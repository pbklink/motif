/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Integer, UiAction, concatenateElementToArrayUniquely, subtractElementFromArrayUniquely } from '@motifmarkets/motif-core';
import { SettingsNgService } from 'component-services-ng-api';
import { ControlComponentBaseNgDirective } from '../../../ng/control-component-base-ng.directive';
import { EnumExplicitElementsArrayElementUiActionNgDirective } from '../../ng/enum-explicit-elements-array-ui-action-element-ng.directive';

@Component({
    selector: 'app-captioned-enum-array-checkbox',
    templateUrl: './captioned-enum-array-checkbox-ng.component.html',
    styleUrls: ['./captioned-enum-array-checkbox-ng.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaptionedEnumArrayCheckboxNgComponent extends EnumExplicitElementsArrayElementUiActionNgDirective implements OnDestroy {
    private static typeInstanceCreateCount = 0;

    @Input() checked = false;

    public checkboxDisabled = true;

    constructor(elRef: ElementRef<HTMLElement>, private _renderer: Renderer2, cdr: ChangeDetectorRef, settingsNgService: SettingsNgService) {
        super(
            elRef,
            ++CaptionedEnumArrayCheckboxNgComponent.typeInstanceCreateCount,
            cdr,
            settingsNgService.service,
            ControlComponentBaseNgDirective.clickControlStateColorItemIdArray
        );
        this.inputId = 'CaptionedEnumArrayCheckbox' + this.typeInstanceId;
    }

    override ngOnDestroy() {
        this.finalise();
    }

    onChange(checked: boolean) {
        const oldValue = this.uiAction.value;
        let newValue: Integer[];
        if (checked) {
            if (oldValue === undefined) {
                newValue = [this.element];
            } else {
                newValue = concatenateElementToArrayUniquely(oldValue, this.element);
            }
        } else {
            if (oldValue === undefined) {
                newValue = []; // control always makes value defined
            } else {
                newValue = subtractElementFromArrayUniquely(oldValue, this.element);
            }
        }

        this.commitValue(newValue);
    }

    protected override applyValue(value: Integer[] | undefined, edited: boolean) {
        super.applyValue(value, edited);
        const newChecked = value === undefined ? false : value.includes(this.element);

        if (newChecked !== this.checked) {
            this.checked = newChecked;
            this.markForCheck();
        }
    }

    protected override applyStateId(newStateId: UiAction.StateId) {
        super.applyStateId(newStateId);
    }

    protected override applyFilter(filter: Integer[] | undefined) {
        super.applyFilter(filter);
        this.updateCheckboxDisabled();
    }

    protected override applyElements() {
        super.applyElements();
        this.updateCheckboxDisabled();
    }

    protected override finalise() {
        super.finalise();
    }

    private updateCheckboxDisabled() {
        const filter = this.uiAction.filter;
        this.checkboxDisabled = this.disabled || (filter !== undefined && !filter.includes(this.element));
    }
}
