import { Component, OnInit } from '@angular/core';

import { EventsService, EventSwapService, EventModel, EventItemModel } from '../../../../shared';

@Component({
  selector: 'eventitem',
  templateUrl: 'eventitem.component.html',
  styleUrls: ['eventitem.scss']
})
export class EventItem implements  OnInit {

  private _event:EventModel;
  private _eventItemsModel:Array<EventItemModel>;

  constructor(private _eventsService:EventsService,
              private _eventSwapService:EventSwapService) {}

  ngOnInit() {
    this._eventItemsModel = [];
    this._event = new EventModel();
    this._eventSwapService.emitter$.subscribe((event:EventModel) => {
      this._event = event;
      this.getEventItems(event);

      if (!this.isOpen('.open-event-container')) {
        this.toggleEvent();
      } else {
        var container = $('.open-event-container');
        container.css('opacity', 0);
        container.animate({opacity: 1}, {queue: false, duration: 'slow'});
      }

      if (this.isOpen('.event-menu')) {
        this.toggleEventMenu();
      }

    });
  }

  private addItem():void {

  }

  private getEventItems(event:EventModel):void {
    this._eventsService.getEventItems(event)
      .then((data:Array<EventItemModel>) => {
        this._eventItemsModel = data;
      });
  }

  private toggleEventMenu() {
    var container = $('.event-menu');
    container.stop().animate({width: 'toggle'}, 'fast');
  }

  private toggleEvent() {
    var cssClass = '.open-event-container';
    var container = $(cssClass);
    container.animate({opacity: this.isOpen(cssClass) ? 0 : 1},
                      {queue: false, duration: 'slow'});
    container.animate({width: 'toggle'}, 'slow');
  }

  private isOpen(cssClass:String):boolean {
    var display = $(cssClass).css('display');
    return display != 'none';
  }

}
