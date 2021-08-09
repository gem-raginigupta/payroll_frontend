import { NgModule } from '@angular/core';
import {
  MatBadgeModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTableModule,
} from '@angular/material';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatListModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: true}

    }
  ]
})
export class MaterialModule { }
