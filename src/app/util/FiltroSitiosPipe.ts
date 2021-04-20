import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroSitios',
    pure: false
})
export class FiltroSitiosPipe implements PipeTransform {
    transform(items: any[], searchTerm: any) {
  
        let filteredList: any = [];
        if (searchTerm) {
            let newSearchTerm = !isNaN(searchTerm) ? searchTerm.toString() : searchTerm.toString().toUpperCase();
            let prop;
            return items.filter(item => {
                for (let key in item) {
                    prop = isNaN(item[key]) ? item[key].toString().toUpperCase() : item[key].toString();
                    if (prop.indexOf(newSearchTerm) > -1) {
                        filteredList.push(item);
                        return filteredList;
                    }
                }
            })
        }
        else {
            return items;
        }
    }    
}
@Pipe({ name: 'SearchPipeGeneral' })
export class SearchPipeGeneral implements PipeTransform {
  transform(value: any, args?: any): any {
    
      if (!value) {
        return null;
      }

      if (!args) {
        return value;
      }

      args = args.toLowerCase();
      console.log("SearchPipeGeneral", args)
      return value.filter((item: any) => {
          if (JSON.stringify(item).toLowerCase().includes(args)){
            console.log("JSON.stringify(item).toLowerCase()", JSON.stringify(item).toLowerCase())
          }
        
          return JSON.stringify(item).toLowerCase().includes(args);
      });
  }
}
