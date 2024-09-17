import type { NextPage } from "next";

import { GridLayout } from "@hey/ui";
import { GridItemTwelve } from "@hey/ui/src/GridLayout";

import AlertDesign from "./AlertDesign";
import ButtonsDesign from "./ButtonsDesign";
import ModalDesign from "./ModalDesign";
import ProfilesDesign from "./ProfilesDesign";
import SpinnerDesign from "./SpinnerDesign";
import ToggleDesign from "./ToggleDesign";
import TooltipDesign from "./TooltipDesign";
import TypographyDesign from "./TypographyDesign";

const Design: NextPage = () => {
  return (
    <GridLayout>
      <GridItemTwelve className="space-y-5">
        <TypographyDesign />
        <ButtonsDesign />
        <AlertDesign />
        <ModalDesign />
        <TooltipDesign />
        <ToggleDesign />
        <SpinnerDesign />
        <ProfilesDesign />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Design;
