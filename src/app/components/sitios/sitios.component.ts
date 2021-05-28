import { Component, OnInit, Input, SimpleChange, ViewChild, ElementRef, NgZone } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SitiosService } from '../../services/sitios.service'
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'
import { MapsAPILoader } from '@agm/core';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { VisitasSitioService } from 'src/app/services/visitas-sitio.service';
@Component({
  selector: 'app-sitios',
  templateUrl: './sitios.component.html',
  styleUrls: ['./sitios.component.css']
})
export class SitiosComponent implements OnInit {
  private geoCoder: any;

  public resultados = false;
  public lat = 0;
  public lng = 0;
  public error = "";
  public cargando = false;
  public suscribirEventoCambiarIdioma: any
  public sitosCercanos: any = [];
  public infoWindow: any = null
  public idioma: any = "es";
  public direccionBusquedaOrigen: string = "";
  public direccionBusquedaDestino: string = "";
  public distancia = 2;
  public direccionActual = "";
  public zoom = 11;
  /*
  private iconBase = '../../../assets/icons/mapa/'
  private urlImagenBase = '../../../assets/images/sitios/'
  */
  private iconBaseLocal = '../../../assets/icons/mapa/'
  private iconBase = environment.iconBase
  private urlImagenBase = environment.urlImagenBase
  private iconEstaAqui = '/assets/imagenesSitioCategorias/you-are-here-2.png'
  public origin: any;
  public destination: any;


  public mapa: any;
  private mapClickListener: any;
  private zone: any;
  public filterargs = { nombre: '' };
  public searchTerm: string = "";

  private coordenadasRuta!: any[];

  @ViewChild(GoogleMap, { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;
  @ViewChild('busquedaOrigen')
  public busquedaOrigenElementRef!: ElementRef;
  @ViewChild('busquedaDestino')
  public busquedaDestinoElementRef!: ElementRef;
  public apiLoaded!: Observable<boolean>;

  @Input()
  eventoCambiarIdioma!: Observable<void>;
  constructor(private translateService: TranslateService,
    private sitiosService: SitiosService,
    private visitasSitioService: VisitasSitioService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.cambiarIdioma('es');
    //this.suscribirEventoCambiarIdioma = this.eventoCambiarIdioma.subscribe(() => this.establecerIdioma())
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocompleteOrigen = new google.maps.places.Autocomplete(this.busquedaOrigenElementRef.nativeElement);
      let autocompleteDestino = new google.maps.places.Autocomplete(this.busquedaDestinoElementRef.nativeElement);
      autocompleteOrigen.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocompleteOrigen.getPlace();
          console.log(place)
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom          
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.origin = { lat: this.lat, lng: this.lng };
          this.zoom = 12;
        });
      });
      autocompleteDestino.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocompleteDestino.getPlace();
          console.log(place)
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom          
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.destination = { lat: this.lat, lng: this.lng };
          this.zoom = 12;
        });
      });
    });
    this.getDirection();
  }
  getDirection() {
    this.origin = { lat: this.lat, lng: this.lng };
    this.destination = { lat: 24.799524, lng: 120.975017 };
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        //this.geoCoder = new google.maps.Geocoder;
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
        this.origin = { lat: position.coords.latitude, lng: position.coords.longitude };

        this.sitosCercanos = [];
        this.mostrarEstoyAqui(position.coords.latitude, position.coords.longitude);
        this.getAddress(this.lat, this.lng);

      });
    }
  }


  public markerDragEnd($event: any) {
    console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.direccionBusquedaOrigen = results[0].formatted_address;
          this.direccionActual = results[0].formatted_address;

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  /* getAddress(latitude, longitude) {
    var promesa = new Promise(function (resolve, reject) {
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            resolve(results[0].formatted_address);
            this.direccionBusquedaOrigen = results[0].formatted_address;
          } else {
            reject('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    });
    return promesa;
  } */
  obtenerValorPropiedad(objeto: any, propiedad: any): string {
    let valor = Object.keys(objeto).map(key => objeto[propiedad]);
    return valor[0];
  }
  cerrar() {
    console.log("cerrar")
    this.sitosCercanos.forEach((value: any, i: any) => {
      this.sitosCercanos[i].punto.animation = null

    });
  }
  getcoords(type: any, event: any) {
    console.log("getcoords")
    console.log(type)
    console.log(event)
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);




    /*
    console.log(coords3);
    let coordenadas: { latitud: any; longitud: any; }[] = [];
    coords3.forEach(function (valor: any) {
      let coordenada = {
        "latitud": valor.lat,
        "longitud": valor.lng,
      }

      coordenadas.push(coordenada)
    });

    console.log("updated longitude :: " + coords3.lng);
    console.log("coordenadas :: " , coordenadas);
    */
  }
  //https://stackoverflow.com/questions/16180104/get-a-polyline-from-google-maps-directions-v3
  //https://webapps.stackexchange.com/questions/34159/how-to-convert-google-map-route-into-array-of-coordinates
  //https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&avoid=highways&mode=bicycling&key=AIzaSyDBNR37FRIeI7ixrWSOFK9QF_SkM9WVTMc
  onChange(event: any) {
    console.log("onChange")
    console.log(event)
    var route = event.routes[0];

    var request = {
      origin: null,
      destination: null,
      travelMode: 'DRIVING'

    };

    var directionsData = event.routes[0].legs[0];

    this.coordenadasRuta = [];
    console.log("directionsData.steps")
    for (var i = 0; i < directionsData.steps.length; i++) {
      this.coordenadasRuta.push({
        "latitud": directionsData.steps[i].start_point.lat(),
        "longitud": directionsData.steps[i].start_point.lng()
      })
    }
    console.log("coordenadas", this.coordenadasRuta)


    /*
        var points = new Array();
        var legs = route.legs;
        for (let i = 0; i < legs.length; i++) {
          var steps = legs[i].steps;
          for (let j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;
            for (let k = 0; k < nextSegment.length; k++) {
              points.push(nextSegment[k]);
              //console.log("coordenadas :: " , nextSegment[k].lat , nextSegment[k].lng);
            }
          }
          
        }*/
    /*
    console.log(points)
    
    let coordenadas: { latitud: any; longitud: any; }[] = [];
    points.forEach(function (valor: any) {
      let coordenada = {
        "latitud": valor.lat,
        "longitud": valor.lng,
      }

      coordenadas.push(coordenada)
    });    
    console.log("coordenadas :: " , coordenadas);
    */
  }
  onResponse(event: any) {
    console.log("onResponse")

    console.log(event)
  }
  clickedMarker(infoWindow: any, gm: any, index: number) {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
    this.infoWindow = infoWindow;
    this.sitosCercanos.forEach((value: any, i: any) => {
      if (i == index) {
        this.sitosCercanos[i].punto.animation = 'BOUNCE'
      } else {
        this.sitosCercanos[i].punto.animation = null
      }
    });
  }

  mapClicked($event: any) {
    console.log("mapClicked")

    if (this.infoWindow) {
      this.infoWindow.close();
    }
  }

  // Obtener la geolocalización
  obtenerPosicion() {
    console.log("obtenerPosicion");
    navigator.geolocation.getCurrentPosition(pos => {
      this.lat = +pos.coords.latitude;
      this.lng = +pos.coords.longitude;

    });
  }

  obtenerSitioCercanos() {
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos);
      let lat = pos.coords.latitude;
      let lng = pos.coords.longitude;
      let punto = {
        latitud: +lat,
        longitud: +lng,
        distancia: +this.distancia * 1000
      }
      console.log(punto);
      this.consultarSitioCercanos(punto)
    });
  }
  consultarSitioCercanos(punto: any) {
    console.log("consultarSitioCercanos")

    this.error = "";
    this.cargando = true;
    this.sitiosService.consultarSitioCercanos(punto)
      .subscribe(
        data => {
          console.log(data)
          let sitosCercanos = JSON.parse(JSON.stringify(data));
          console.log(this.sitosCercanos)
          this.mostrarSitiosCercanos(punto, sitosCercanos);

          this.cargando = false;
        },
        error => {
          this.cargando = false;
          this.error = error;
        });
  }
  obtenerSitioCercanosRuta() {
    let punto = {
      coordenadas: this.coordenadasRuta,
      distancia: +this.distancia * 1000
    }
    console.log(punto);
    this.consultarSitioCercanosRuta(punto)
  }
  consultarSitioCercanosRuta(punto: any) {
    console.log("consultarSitioCercanosRuta")

    this.error = "";
    this.cargando = true;
    this.sitiosService.consultarSitioCercanosRuta(punto)
      .subscribe(
        data => {
          console.log(data)
          let sitosCercanos = JSON.parse(JSON.stringify(data));
          console.log(this.sitosCercanos)
          this.mostrarSitiosCercanos(punto, sitosCercanos);

          this.cargando = false;
        },
        error => {
          this.cargando = false;
          this.error = error;
        });
  }
  borrarSitiosCercanos() {
    this.sitosCercanos = [];
  }
  mostrarEstoyAqui(latitud: any, longitud: any) {
    let idiomas = {
      es: {
        nombre: "Estas aquí",
        descripcion: "Estas aquí"
      },
      en: {
        nombre: "Are you here",
        descripcion: "Are you here"
      }
    }
    let idiomasCategoria = {
      idiomas: {
        es: {
          nombre: "Estas aquí"
        },
        en: {
          nombre: "Are you here"
        }
      }
    }
    this.sitosCercanos.push({
      punto: {
        id:null,
        tipo: 1,
        latitud: +latitud,
        longitud: +longitud,
        animation: 'BOUNCE',
        icono: this.iconBase + this.iconEstaAqui,        
        nombre: 'Estas aquí',
        idiomas: idiomas,
        descripcion: '',
        categoria: idiomasCategoria,
        imagen: '',
        direccion: '',
        telefono: '',
        URLWeb: '',
        URLContacto: '',
        URLRelacionada: '',
        URLCalificacion: '',
        url: '',
        distancia: '1.5',
        draggable: true

      }
    })
  }
 
  registrarVisitaSitio(id:string, url: string, tipo:string) {
    let visitasSitio = {
      sitio: id,
      tipoVisita: tipo,
      urlVisita: url,
      fecha: new Date() 
    }
    
    console.log("registrarVisitaSitio", visitasSitio)

    this.error = "";
    this.cargando = true;
    this.visitasSitioService.crearVisitaSitio(visitasSitio)
      .subscribe(
        data => {
          this.cargando = false;
        },
        error => {
          this.cargando = false;
          this.error = error;
        });
  }

  mostrarSitiosCercanos(punto: any, sitosCercanos: any) {
    this.sitosCercanos = [];

    this.mostrarEstoyAqui(punto.latitud, punto.longitud);
    for (let sito of sitosCercanos) {
      let imagen = null
      if (sito.urlImagen){
         imagen = this.urlImagenBase + sito.urlImagen
      }
      
      this.sitosCercanos.push({
        punto: {
          id:sito.id,
          tipo: 2,
          latitud: +sito.punto.coordinates[1],
          longitud: +sito.punto.coordinates[0],
          animation: 'DROP',
          icono: this.iconBase + sito.categoria.urlImagen,
          nombre: sito.nombre,
          idiomas: sito.idiomas,
          categoria: sito.categoria,
          imagen: imagen,
          direccion: sito.direccion,
          telefono: sito.telefono,
          url: sito.url,
          URLWeb: sito.URLWeb,
          URLContacto: sito.URLContacto,
          URLRelacionada: sito.URLRelacionada,
          URLCalificacion: sito.URLCalificacion,         
          distancia: '3.5',
          draggable: true

        }
      })
    }
    console.log(this.sitosCercanos)
  }
  editarMarcador(marcador: any) {
    marcador.punto.animation = 'BOUNCE'
  }
  ngOnDestroy() {
    this.suscribirEventoCambiarIdioma.unsubscribe()
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }
  public mapReadyHandler(map: google.maps.Map): void {
    this.mapa = map;
    this.mapClickListener = this.mapa.addListener('click', (e: google.maps.MouseEvent) => {
      console.log(e.latLng.lat(), e.latLng.lng());
    });
  }
  /*****Traductor */
  establecerIdioma() {
    this.idioma = sessionStorage.getItem("Idioma");
    this.translateService.use(this.idioma);
  }
  cambiarIdioma(idioma: string) {
    sessionStorage.setItem("Idioma", idioma);
    this.translateService.use(idioma);
    this.establecerIdioma();
  }



}
