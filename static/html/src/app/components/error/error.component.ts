import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  @Input() errorMessage: string;
  @Input() retryText: string;
  @Input() retryParam: any;
  @Output() retryEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  retry() {
    this.retryEvent.emit(this.retryParam);
  }

}
