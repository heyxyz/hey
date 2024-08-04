import axios from 'axios';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = params;

  if (!id) {
    return <h1>404</h1>;
  }

  const {
    data
  }: {
    data: {
      result: {
        address: string;
        createdAt: string;
        id: string;
        name: string;
        rate: number;
      };
    };
  } = await axios.get('https://api.hey.xyz/invoices/signup', {
    params: { id }
  });

  if (!data.result) {
    return <h1>404</h1>;
  }

  const { address, createdAt, id: invoiceId, name, rate } = data.result;

  return (
    <div className="mx-auto my-4 max-w-[85rem] px-4 sm:my-10 sm:px-6 lg:px-8">
      <div className="mx-auto sm:w-11/12 lg:w-3/4">
        <div className="flex flex-col rounded-xl border bg-white p-4 sm:p-10">
          <div className="flex justify-between">
            <div>
              <img
                alt="Logo"
                className="size-8"
                src="https://hey.xyz/logo.png"
              />
              <h1 className="text-brand-600 mt-4 text-xl font-bold">
                Yoginth from Hey
              </h1>
            </div>
            <div className="text-end">
              <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
                Invoice
              </h2>
              <span className="mt-1 block text-gray-500">{invoiceId}</span>
              <address className="mt-4 not-italic text-gray-800">
                Yoginth
                <br />
                HD-322, WeWork Latitude, Hebbal
                <br />
                Bangalore, Karnataka 560024
                <br />
                India
                <br />
                billing@heyxyz.zohodesk.in
                <br />
                <div className="pt-2" />
                <b className="text-gray-500">GST: 29AYKPY4219R1Z8</b>
              </address>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div>
              <b className="text-lg text-gray-800">Bill to</b>
              <h5 className="text-lg font-semibold text-gray-800">{name}</h5>
              <address className="mt-2 not-italic text-gray-800">
                {address}
              </address>
            </div>
            <div className="space-y-2 sm:text-end">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
                <dl className="grid gap-x-3 sm:grid-cols-5">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Invoice date:
                  </dt>
                  <dd className="col-span-2 text-gray-500">
                    {new Date(createdAt).toLocaleDateString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="hidden sm:grid sm:grid-cols-5">
                <div className="text-xs font-medium uppercase text-gray-500 sm:col-span-2">
                  Item
                </div>
                <div className="text-start text-xs font-medium uppercase text-gray-500">
                  Qty
                </div>
                <div className="text-start text-xs font-medium uppercase text-gray-500">
                  Rate
                </div>
                <div className="text-end text-xs font-medium uppercase text-gray-500">
                  Amount
                </div>
              </div>
              <div className="border-b" />
              <div className="grid grid-cols-5 gap-2">
                <b className="col-span-2 font-medium text-gray-800">
                  Lens Profile
                </b>
                <p className="text-gray-800">1</p>
                <p className="text-gray-800">₹{rate}</p>
                <p className="text-end text-gray-800">₹{rate}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-2xl space-y-2 sm:text-end">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
                <dl className="grid gap-x-3 sm:grid-cols-5">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Subtotal:
                  </dt>
                  <dd className="col-span-2 text-gray-500">₹{rate}</dd>
                </dl>

                <dl className="grid gap-x-3 sm:grid-cols-5">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Total:
                  </dt>
                  <dd className="col-span-2 text-gray-500">₹{rate}</dd>
                </dl>
                <dl className="grid gap-x-3 sm:grid-cols-5">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Amount paid:
                  </dt>
                  <dd className="col-span-2 text-gray-500">₹{rate}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
