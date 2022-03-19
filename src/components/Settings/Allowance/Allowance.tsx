import { gql, useLazyQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { ApprovedAllowanceAmount } from '@generated/types'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
import React from 'react'
import { useTransaction } from 'wagmi'

const GENERATE_ALLOWANCE_QUERY = gql`
  query GenerateModuleCurrencyApprovalData(
    $request: GenerateModuleCurrencyApprovalDataRequest!
  ) {
    generateModuleCurrencyApprovalData(request: $request) {
      to
      from
      data
    }
  }
`

interface Props {
  allowance: any
}

const Allowance: React.FC<Props> = ({ allowance }) => {
  const [generateAllowanceQuery, {}] = useLazyQuery(GENERATE_ALLOWANCE_QUERY)

  const [{}, sendTransaction] = useTransaction()

  const handleAllowance = (
    currencies: string,
    value: string,
    module: string
  ) => {
    generateAllowanceQuery({
      variables: {
        request: {
          currency: currencies,
          value: value,
          collectModule: module
        }
      }
    }).then((res) => {
      const data = res?.data?.generateModuleCurrencyApprovalData
      sendTransaction({
        request: { from: data.from, to: data.to, data: data.data }
      })
    })
  }

  return (
    <CardBody className="space-y-4">
      {allowance?.approvedModuleAllowanceAmount?.map(
        (item: ApprovedAllowanceAmount) => (
          <Card key={item.module}>
            <CardBody className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="text-brand-500">
                    <GetModuleIcon module={item.module} size={4} />
                  </div>
                  <div className="font-bold">{getModule(item.module).name}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {item.contractAddress}
                </div>
              </div>
              {item.allowance === '0x00' ? (
                <Button
                  variant="success"
                  icon={<PlusIcon className="w-4 h-4" />}
                  onClick={() =>
                    handleAllowance(item.currency, '10000000000', item.module)
                  }
                >
                  Allow
                </Button>
              ) : (
                <Button
                  variant="warning"
                  icon={<MinusIcon className="w-4 h-4" />}
                  onClick={() =>
                    handleAllowance(item.currency, '0', item.module)
                  }
                >
                  Revoke
                </Button>
              )}
            </CardBody>
          </Card>
        )
      )}
    </CardBody>
  )
}

export default Allowance
