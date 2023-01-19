import { Button } from '@components/UI/Button';
import { HomeIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

const Buttons: FC = () => {
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold">Buttons</div>
      <div className="space-y-3">
        <div className="text-lg font-bold">Specs</div>
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="lg" icon={<HomeIcon className="h-5 w-5" />}>
              Large
            </Button>
            <div className="text-sm">
              <div>
                <b>padding-x: </b>16px
              </div>
              <div>
                <b>padding-y: </b>6px
              </div>
              <div>
                <b>font-size: </b> 16px
              </div>
              <div>
                <b>icon-size: </b> 20px
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="md" icon={<HomeIcon className="h-4 w-4" />}>
              Medium
            </Button>
            <div className="text-sm">
              <div>
                <b>padding-x: </b>12px
              </div>
              <div>
                <b>padding-y: </b>4px
              </div>
              <div>
                <b>font-size: </b> 16px
              </div>
              <div>
                <b>icon-size: </b> 16px
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="sm" icon={<HomeIcon className="h-3 w-3" />}>
              Small
            </Button>
            <div className="text-sm">
              <div>
                <b>padding-x: </b>12px
              </div>
              <div>
                <b>padding-y: </b>2px
              </div>
              <div>
                <b>font-size: </b> 14px
              </div>
              <div>
                <b>icon-size: </b> 12px
              </div>
            </div>
          </div>
        </div>
        <div className="text-lg font-bold">Style</div>
        <div className="space-x-3">
          <Button variant="primary" size="lg" outline>
            Primary outline
          </Button>
          <Button variant="primary" size="lg" outline disabled>
            Primary outline disabled
          </Button>
          <Button variant="primary" size="lg" disabled>
            Primary disabled
          </Button>
          <Button variant="primary" size="lg">
            Primary large
          </Button>
          <Button variant="primary" size="md">
            Primary medium
          </Button>
          <Button variant="primary" size="sm">
            Primary small
          </Button>
        </div>
        <div className="space-x-3">
          <Button variant="secondary" size="lg" outline>
            Secondary outline
          </Button>
          <Button variant="secondary" size="lg" outline disabled>
            Secondary outline disabled
          </Button>
          <Button variant="secondary" size="lg" disabled>
            Secondary disabled
          </Button>
          <Button variant="secondary" size="lg">
            Secondary large
          </Button>
          <Button variant="secondary" size="md">
            Secondary medium
          </Button>
          <Button variant="secondary" size="sm">
            Secondary small
          </Button>
        </div>
        <div className="space-x-3">
          <Button variant="warning" size="lg" outline>
            Warning outline
          </Button>
          <Button variant="warning" size="lg" outline disabled>
            Warning outline disabled
          </Button>
          <Button variant="warning" size="lg" disabled>
            Warning disabled
          </Button>
          <Button variant="warning" size="lg">
            Warning large
          </Button>
          <Button variant="warning" size="md">
            Warning medium
          </Button>
          <Button variant="warning" size="sm">
            Warning small
          </Button>
        </div>
        <div className="space-x-3">
          <Button variant="danger" size="lg" outline>
            Danger outline
          </Button>
          <Button variant="danger" size="lg" outline disabled>
            Danger outline disabled
          </Button>
          <Button variant="danger" size="lg" disabled>
            Danger disabled
          </Button>
          <Button variant="danger" size="lg">
            Danger large
          </Button>
          <Button variant="danger" size="md">
            Danger medium
          </Button>
          <Button variant="danger" size="sm">
            Danger small
          </Button>
        </div>
        <div className="space-x-3">
          <Button variant="super" size="lg" outline>
            Super outline
          </Button>
          <Button variant="super" size="lg" outline disabled>
            Super outline disabled
          </Button>
          <Button variant="super" size="lg" disabled>
            Super disabled
          </Button>
          <Button variant="super" size="lg">
            Super large
          </Button>
          <Button variant="super" size="md">
            Super medium
          </Button>
          <Button variant="super" size="sm">
            Super small
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Buttons;
