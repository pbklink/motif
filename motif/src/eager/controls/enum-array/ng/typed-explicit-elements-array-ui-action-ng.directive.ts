/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Directive, Input } from '@angular/core';
import { MultiEvent, TypedExplicitElementsArrayUiAction, UiAction, isUndefinableArrayEqualUniquely } from '@motifmarkets/motif-core';
import { ControlComponentBaseNgDirective } from '../../ng/control-component-base-ng.directive';

@Directive()
export abstract class TypedExplicitElementsArrayUiActionNgDirective<T> extends ControlComponentBaseNgDirective {
    @Input() inputId: string;

    private _pushEnumEventsSubscriptionId: MultiEvent.SubscriptionId;

    private _filter: readonly T[] | undefined;

    override get uiAction() { return super.uiAction as TypedExplicitElementsArrayUiAction<T>; }

    protected applyValue(_value: readonly T[] | undefined, _edited: boolean) {
        this.markForCheck();
    }

    protected applyFilter(filter: readonly T[] | undefined) {
        if (filter === undefined) {
            this._filter = undefined;
        } else {
            this._filter = filter.slice();
        }
    }

    protected applyElementTitle(enumValue: T, title: string) {
        // for descendants
    }
    protected applyElementCaption(enumValue: T, caption: string) {
        // for descendants
    }
    protected applyElements() {
        // for descendants
    }

    protected commitValue(value: readonly T[] | undefined) {
        if (value !== undefined) {
            this.uiAction.commitValue(value, UiAction.CommitTypeId.Explicit);
        } else {
            if (!this.uiAction.valueRequired) {
                this.uiAction.commitValue(undefined, UiAction.CommitTypeId.Explicit);
            }
        }
    }

    protected override setUiAction(action: TypedExplicitElementsArrayUiAction<T>) {
        super.setUiAction(action);

        const pushEventHandlersInterface: TypedExplicitElementsArrayUiAction.PushEventHandlersInterface<T> = {
            value: (value, edited) => this.handleValuePushEvent(value, edited),
            filter: (filter) => this.handleFilterPushEvent(filter),
            element: (element, caption, title) => this.handleElementPushEvent(element, caption, title),
            elements: () => this.handleElementsPushEvent(),
        };
        this._pushEnumEventsSubscriptionId = this.uiAction.subscribePushEvents(pushEventHandlersInterface);

        this.applyValue(action.value, action.edited);
        this.applyFilter(action.filter);
    }

    protected override finalise() {
        this.uiAction.unsubscribePushEvents(this._pushEnumEventsSubscriptionId);
        super.finalise();
    }

    private handleValuePushEvent(value: readonly T[] | undefined, edited: boolean) {
        this.applyValue(value, edited);
    }

    private handleFilterPushEvent(filter: readonly T[] | undefined) {
        if (!isUndefinableArrayEqualUniquely(filter, this._filter)) {
            this.applyFilter(filter);
        }
    }

    private handleElementPushEvent(element: T, caption: string, title: string) {
        this.applyElementTitle(element, title);
        this.applyElementCaption(element, caption);
    }

    private handleElementsPushEvent() {
        this.applyElements();
    }
}
