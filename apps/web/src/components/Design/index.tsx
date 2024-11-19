import { GridItemTwelve, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import AccountsDesign from "./AccountsDesign";
import AlertDesign from "./AlertDesign";
import BadgeDesign from "./BadgeDesign";
import ButtonsDesign from "./ButtonsDesign";
import CardDesign from "./CardDesign";
import CheckboxDesign from "./CheckboxDesign";
import EmptyStateDesign from "./EmptyStateDesign";
import ErrorMessageDesign from "./ErrorMessageDesign";
import HelpTooltipDesign from "./HelpTooltipDesign";
import ImageDesign from "./ImageDesign";
import InputDesign from "./InputDesign";
import ModalDesign from "./ModalDesign";
import NumberedStatDesign from "./NumberedStatDesign";
import RangeSliderDesign from "./RangeSliderDesign";
import SelectDesign from "./SelectDesign";
import SpinnerDesign from "./SpinnerDesign";
import StackedAvatarsDesign from "./StackedAvatarsDesign";
import TabButtonDesign from "./TabButtonDesign";
import TextAreaDesign from "./TextAreaDesign";
import ToggleDesign from "./ToggleDesign";
import TooltipDesign from "./TooltipDesign";
import TypographyDesign from "./TypographyDesign";
import WarningMessageDesign from "./WarningMessageDesign";

const Design: NextPage = () => {
  return (
    <GridLayout>
      <GridItemTwelve className="space-y-5">
        <TypographyDesign />
        <ButtonsDesign />
        <AlertDesign />
        <ModalDesign />
        <TooltipDesign />
        <HelpTooltipDesign />
        <ToggleDesign />
        <CheckboxDesign />
        <InputDesign />
        <TextAreaDesign />
        <SelectDesign />
        <RangeSliderDesign />
        <SpinnerDesign />
        <BadgeDesign />
        <TabButtonDesign />
        <ImageDesign />
        <StackedAvatarsDesign />
        <CardDesign />
        <EmptyStateDesign />
        <WarningMessageDesign />
        <ErrorMessageDesign />
        <NumberedStatDesign />
        <AccountsDesign />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Design;
