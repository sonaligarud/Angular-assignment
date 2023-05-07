import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


export interface Records {
  id: any;
  userName: string;
  phoneNumber: string;
  email: string;
}

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('dragHandle', { static: false }) dragHandle: ElementRef;

  deleteRecordList: Array<any> = [];

  displayedColumns = ['checkRecord', 'userName', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<Records>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.apiData();
  }

  apiData()
  {
    this.http.get<Records[]>('http://localhost:3000/data')
      .subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit() {
    if (this.dragHandle) {
      const row = this.dragHandle.nativeElement.parentElement.parentElement;
      row.setAttribute('cdkDrag', '');
    }
  }

  dropTable(event: CdkDragDrop<Records[]>) {
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = [...this.dataSource.data];
  }


  deleteRecord(record: any) {
    alert("Are you sure want to delete selected row data");
    this.deleteRecordList = [];
    this.deleteRecordList.push(record);
    for (let index = 0; index < this.deleteRecordList.length; index++) {
     
      const element = this.deleteRecordList[index];
      console.log(element);
      this.deleteData(element);
    }
  }


  deleteData(record) {
    this.http.delete(`http://localhost:3000/data/${record}`)
    .subscribe(() => {
      this.apiData();
    });
  }

  pushDeleteId(record: any): void {
    const result = this.deleteRecordList.filter(res => res === record.id);
    if (result.length === 0) {
      this.deleteRecordList.push(record.id);
    } else {
      const index = this.deleteRecordList.findIndex(res => res === record.id);
      this.deleteRecordList.splice(index, 1);
    }
  }
  
  deleteMultiple()
  {
    for (let index = 0; index < this.deleteRecordList.length; index++) {
      const element = this.deleteRecordList[index];
      this.deleteData(element);
    }
  }

  getStatus(id:any)
  {
    let result=this.deleteRecordList.filter(res=>res==id);
    if(result.length>0)
    {
      return true
    }
    else{
      return false;
    }
  }
  

}
