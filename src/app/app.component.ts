import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export interface Row {
  id: number;
  name: string;
  age: string;
  country: string;
}
export interface ColumnData {
  name: string;
  completed: boolean;
  color: ThemePalette;
  columnValues?: ColumnData[];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedItems:any=[];
  columnData: ColumnData = {
    name: 'Filter',
    completed: false,
    color: 'primary',
    columnValues: [
    ],
  };
  rowValues: Row[] =[
    { id: 1, name: 'Value 1',age:"30", country: 'Value 5' },
    { id: 2, name: 'Alice', age: "29", country: 'Canada' },
    { id: 3, name: 'Alice4', age: "23", country: 'USA' },
    { id: 4, name: 'Ali', age: "27", country: 'INDIA' },
    { id: 5, name: 'lie', age: "49", country: 'Australia' },
    { id: 1, name: 'Value 1',age:"30", country: 'Value 5' },
    { id: 2, name: 'Alice', age: "29", country: 'Canada' },
    { id: 3, name: 'Alice4', age: "23", country: 'USA' },
    { id: 4, name: 'Ali', age: "27", country: 'INDIA' },
    { id: 5, name: 'lie', age: "49", country: 'Australia' },
  ] ;
  allComplete: boolean = false;
  roles:any=[]
  dataSource!: MatTableDataSource<Row>;
  displayedColumns: string[] = ['id', 'name', 'age', 'country'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild('addColumn') addNewColumnTemplate:TemplateRef<any>;
@ViewChild('filter') filterTemplate:TemplateRef<any>;
columnFilters: { [key: string]: FormControl } = {};
rowLimitOptions: number[] = [10, 20, 50];
selectedLimit: number = 10;
  selectedValue: any={value:[],click:false};
  last: number=0;
  modalRef: BsModalRef;
  selectedPosition: any;
  selectedColumn: any;
  selectedName:string;
  distinctColumnValues: any[];
  dropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; classes: string; };
  dropdownList: any[];
  filterOptions:any=[];
  chipText: string = '';
  constructor(public bsModalService: BsModalService) { }
ngOnInit(): void {
  this.dataSource = new MatTableDataSource(this.rowValues);
  this.initColumnFilters();
}
addNewColumn(position: 'left' | 'right',column : string,name:string): void {
  if(!this.displayedColumns.includes(name)){
    const selectedIndex = this.displayedColumns.indexOf(column); 

    if (selectedIndex !== -1) {
      const newColumnName = name;
      if (position === 'left') {
        this.displayedColumns.splice(selectedIndex, 0, newColumnName);
      } else {
        this.displayedColumns.splice(selectedIndex + 1, 0, newColumnName);
      }
      this.dataSource.data.forEach(row => {
        row[newColumnName] = ''; 
      });

      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.selectedColumn='';
    this.selectedPosition='';
  }
  this.modalRef.hide();
}
deleteColumn(column: string): void {
  const columnIndex = this.displayedColumns.indexOf(column);
  if (columnIndex !== -1) {
    this.displayedColumns.splice(columnIndex, 1);
    this.dataSource.data.forEach(row => {
      delete row[column];
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

clearColumn(column: string): void {
  const columnIndex = this.displayedColumns.indexOf(column);
  if (columnIndex !== -1) {
    this.dataSource.data.forEach(row => {
      row[column] = '';
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
getUniqueValues(column: string): any[] {
  let value= Array.from(new Set(this.dataSource.data.map(item => item[column])));
  this.last=value.length-1;
  let objArray:any=[];
  value.forEach((item,index)=>{
    let obj:any={
      id:index,
      itemName:item,
    }
    objArray.push(obj);
  });
  this.distinctColumnValues=Array.from(new Set(this.rowValues.map(item => item[column])));
  this.columnData.columnValues=objArray;
  return objArray;
}
ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
createChipText(filterValues) {
  this.chipText = '';
  if(filterValues) {
      var result = '';
      for(let i=0; i<filterValues.length; i++) {
          let filterCount = filterValues[i].toString().length;
          if(filterCount) {
              result += `${this.selectedColumn}(${filterValues[i]}); `;
          }
      }
      this.chipText = result;
  }
}
clearChip() {
this.chipText = '';
this.filterOptions=[];
}
applyFilter(selectedOptions: any,column:string): void {
  this.createChipText(selectedOptions);
  const originalData = this.dataSource.data.slice();
  if(!selectedOptions)
  return;
  if (selectedOptions.length === 0) {
    this.dataSource.data = originalData;
    return;
  }
  const filteredData = originalData.filter(row => {
    return selectedOptions.some(option => {
      return row[column].toString().includes(option.toString());
    });
  });
  this.dataSource.data = filteredData;
  this.modalRef.hide();
}


customSort(column: string, direction: 'asc' | 'desc'): void {
  this.dataSource.data = this.dataSource.data.sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (direction === 'asc') ? valueA - valueB : valueB - valueA;
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      return (direction === 'asc') ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      return 0;
    }
  });
}
initColumnFilters(): void {
  this.displayedColumns.forEach(column => {
    this.columnFilters[column] = new FormControl('');
  });
}
resetFilters(): void {
  this.selectedValue.value=[];
  this.selectedItems=[];
  this.clearChip();
  this.dataSource = new MatTableDataSource(this.rowValues); 
  this.initColumnFilters();
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

    applyFilterTable(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    openModal(template: TemplateRef<any>) {
      this.modalRef = this.bsModalService.show(template, { class: "modalClass" });
    }

    addNewColumnTemp(column,position){
      this.selectedColumn=column,
      this.selectedPosition=position
      this.openModal(this.addNewColumnTemplate);
    }





openFilterFor(column){
  console.log("test",this.selectedItems);
  if(this.filterOptions[column]&&!this.selectedItems){
    this.filterOptions[column].value.forEach((item,index) => {
      this.selectedItems.forEach((value) => {
        if(!value.itemName==item){
          let obj:any={id:index,itemName:item.value}
          this.selectedItems.push(obj);
        }
      });
    });
  }else if(this.filterOptions[column]){
    this.filterOptions[column].value.forEach((item,index) => {
      this.selectedItems.forEach((value) => {
        if(!value.itemName==item){
          let obj:any={id:index,itemName:item.value}
          this.selectedItems.push(obj);
        }
      });
    })
  }
  this.dropdownSettings = { 
    singleSelection: false, 
    text:"Select"+column,
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class md-4 ml-10"
  };
  this.selectedColumn=column
  this.clearChip();
  this.dropdownList=this.getUniqueValues(column);
  this.openModal(this.filterTemplate);
}
onItemSelect(item:any){
  if(!this.filterOptions[this.selectedColumn]){
    this.filterOptions[this.selectedColumn]={value:[]};
    this.filterOptions[this.selectedColumn].value.push(item.itemName);
    this.filterOptions[this.selectedColumn].value.forEach((item,index) => {
      this.selectedItems.forEach((value) => {
        if(!value.itemName==item){
          let obj:any={id:index,itemName:item.value}
          this.selectedItems.push(obj);
        }
      });
    });
  }
  else if(this.filterOptions[this.selectedColumn]){
    if(!this.filterOptions[this.selectedColumn].value.includes(item.itemName)){
      this.filterOptions[this.selectedColumn].value.push(item.itemName);
      this.filterOptions[this.selectedColumn].value.forEach((item,index) => {
        this.selectedItems.forEach((value) => {
          if(!value.itemName==item){
            let obj:any={id:index,itemName:item.value}
            this.selectedItems.push(obj);
          }
        });
      });
    }else{
      return
    }
  }
}
OnItemDeSelect(item:any){
if(!this.filterOptions[this.selectedColumn]){
  return;
}
else if(this.filterOptions[this.selectedColumn]){
  if(this.filterOptions[this.selectedColumn].value.includes(item.itemName)){
    this.filterOptions[this.selectedColumn].value.pop(item.itemName);
  }
}
}
onSelectAll(items: any){
if(!this.filterOptions[this.selectedColumn]){
  this.filterOptions[this.selectedColumn]={value:[]};
  items.forEach((item)=>{
    this.filterOptions[this.selectedColumn].value.push(item.itemName);
  })
}
else if(this.filterOptions[this.selectedColumn]){
  items.forEach((item)=>{
    if(!this.filterOptions[this.selectedColumn].values.includes(item.itemName)){
      this.filterOptions[this.selectedColumn].values.push(item.itemName);
    }
  })
}
  
}
onDeSelectAll(items: any){
if(!this.filterOptions[this.selectedColumn]){
  return;
}
else if(this.filterOptions[this.selectedColumn]){
  items.forEach((item)=>{
    if(this.filterOptions[this.selectedColumn].values.includes(item.itemName)){
      this.filterOptions[this.selectedColumn].values.pop(item.itemName);
    }
  })
}
}
applyMultiFilter(){
let filterValues:any=[];
if(this.filterOptions.length>0){
  if(this.filterOptions[this.selectedColumn]){
    this.filterOptions[this.selectedColumn].value.forEach((value,index)=>{
        filterValues.push(value);
        this.selectedItems.forEach((item) => {
          if(!item.itemName==value){
            let obj:any={id:index,itemName:value}
            this.selectedItems.push(obj);
          }
        });
      })
    }
}else if(this.selectedItems){
  this.selectedItems.forEach(element => {
    filterValues.push(element.itemName);
  });
}
this.applyFilter(filterValues,this.selectedColumn);
console.log("test2",this.selectedItems);
}
}