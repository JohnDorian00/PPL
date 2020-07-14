/// <reference path="../jqwidgets.d.ts" />
import { EventEmitter, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
export declare class jqxNotificationComponent implements OnChanges {
    attrAppendContainer: string;
    attrAutoOpen: boolean;
    attrAnimationOpenDelay: number;
    attrAnimationCloseDelay: number;
    attrAutoClose: boolean;
    attrAutoCloseDelay: number | string;
    attrBlink: boolean;
    attrBrowserBoundsOffset: number;
    attrCloseOnClick: boolean;
    attrDisabled: boolean;
    attrHoverOpacity: number;
    attrIcon: jqwidgets.NotificationIcon;
    attrNotificationOffset: number;
    attrOpacity: number;
    attrPosition: string;
    attrRtl: boolean;
    attrShowCloseButton: boolean;
    attrTemplate: string;
    attrTheme: string;
    attrWidth: string | number;
    attrHeight: string | number;
    autoCreate: boolean;
    properties: string[];
    host: any;
    elementRef: ElementRef;
    widgetObject: jqwidgets.jqxNotification;
    constructor(containerElement: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): boolean;
    arraysEqual(attrValue: any, hostValue: any): boolean;
    manageAttributes(): any;
    moveClasses(parentEl: HTMLElement, childEl: HTMLElement): void;
    moveStyles(parentEl: HTMLElement, childEl: HTMLElement): void;
    createComponent(options?: any): void;
    createWidget(options?: any): void;
    __updateRect__(): void;
    setOptions(options: any): void;
    appendContainer(arg?: string): string;
    autoOpen(arg?: boolean): boolean;
    animationOpenDelay(arg?: number): number;
    animationCloseDelay(arg?: number): number;
    autoClose(arg?: boolean): boolean;
    autoCloseDelay(arg?: number | string): number | string;
    blink(arg?: boolean): boolean;
    browserBoundsOffset(arg?: number): number;
    closeOnClick(arg?: boolean): boolean;
    disabled(arg?: boolean): boolean;
    height(arg?: number | string): number | string;
    hoverOpacity(arg?: number): number;
    icon(arg?: jqwidgets.NotificationIcon): jqwidgets.NotificationIcon;
    notificationOffset(arg?: number): number;
    opacity(arg?: number): number;
    position(arg?: string): string;
    rtl(arg?: boolean): boolean;
    showCloseButton(arg?: boolean): boolean;
    template(arg?: string): string;
    theme(arg?: string): string;
    width(arg?: string | number): string | number;
    closeAll(): void;
    closeLast(): void;
    destroy(): void;
    open(): void;
    refresh(): void;
    render(): void;
    onClose: EventEmitter<any>;
    onClick: EventEmitter<any>;
    onOpen: EventEmitter<any>;
    __wireEvents__(): void;
}
