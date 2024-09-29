import { GridLayout } from "@hey/ui";
import { GridItemTwelve } from "@hey/ui/src/GridLayout";
import type { NextPage } from "next";
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
import ProfilesDesign from "./ProfilesDesign";
import SelectDesign from "./SelectDesign";
import SpinnerDesign from "./SpinnerDesign";
import StackedAvatarsDesign from "./StackedAvatarsDesign";
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
        <SpinnerDesign />
        <BadgeDesign />
        <ImageDesign />
        <StackedAvatarsDesign />
        <CardDesign />
        <EmptyStateDesign />
        <WarningMessageDesign />
        <ErrorMessageDesign />
        <ProfilesDesign />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Design;
