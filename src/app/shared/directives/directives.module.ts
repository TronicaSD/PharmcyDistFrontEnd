import { NgModule } from "@angular/core";
import { NumbersOnlyDirective } from "./number-only.directive";
import { CharacterOnlyDirective } from "./character-only.directive";
import { TwoDigitDecimaNumberDirective } from "./two-digit-decimal-number.directive";

@NgModule({
  declarations: [
    NumbersOnlyDirective,
    CharacterOnlyDirective,
    TwoDigitDecimaNumberDirective
  ],
  imports: [],
  exports: [
    NumbersOnlyDirective,
    CharacterOnlyDirective,
    TwoDigitDecimaNumberDirective
  ],
  entryComponents: []
})
export class DirectivesModule {}
