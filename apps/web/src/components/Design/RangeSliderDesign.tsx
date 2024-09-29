import { Card, CardHeader, RangeSlider } from "@hey/ui";
import { type FC, useState } from "react";

const RangeSliderDesign: FC = () => {
  const [value, setValue] = useState(0);

  return (
    <Card>
      <CardHeader title="Range Slider" />
      <div className="m-5 flex flex-col items-start gap-5">
        <div className="w-full">
          <div className="label pb-2">Simple Range Slider</div>
          <RangeSlider
            displayValue={value.toString()}
            onValueChange={(value) => setValue(value[0])}
          />
        </div>
        <div className="w-full">
          <div className="label pb-2">Range Slider with value in thumb</div>
          <RangeSlider
            displayValue={value.toString()}
            onValueChange={(value) => setValue(value[0])}
            showValueInThumb
          />
        </div>
        <div className="w-full">
          <div className="label pb-2">Range Slider with max value</div>
          <RangeSlider
            displayValue={value.toString()}
            onValueChange={(value) => setValue(value[0])}
            max={1000}
            showValueInThumb
          />
        </div>
      </div>
    </Card>
  );
};

export default RangeSliderDesign;
