import { gql, useLazyQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { ApprovedAllowanceAmount } from '@generated/types'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
import { trackEvent } from '@lib/trackEvent'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'
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
  module: ApprovedAllowanceAmount
}

const Module: React.FC<Props> = ({ module }) => {
  const [allowed, setAllowed] = useState<boolean>(module.allowance === '0x00')
  const [generateAllowanceQuery, { loading: queryLoading, error }] =
    useLazyQuery(GENERATE_ALLOWANCE_QUERY)

  const [{ loading: transactionLoading }, sendTransaction] = useTransaction()

  const handleAllowance = (
    currencies: string,
    value: string,
    selectedModule: string
  ) => {
    generateAllowanceQuery({
      variables: {
        request: {
          currency: currencies,
          value: value,
          [getModule(module.module).type]: selectedModule
        }
      }
    }).then((res) => {
      const data = res?.data?.generateModuleCurrencyApprovalData
      sendTransaction({
        request: { from: data.from, to: data.to, data: data.data }
      }).then(({ error }) => {
        if (!error) {
          setAllowed(value === '0' ? true : false)
          toast.success(
            `Module ${value === '0' ? 'disabled' : 'enabled'} successfully!`
          )
          trackEvent(
            `${value === '0' ? 'disabled' : 'enabled'} module allowance`
          )
        } else {
          toast.error(error.message)
        }
      })
    })
  }

  return (
    <Card key={module.module}>
      {error && (
        <ErrorMessage
          className="mx-5 mt-5"
          title={ERROR_MESSAGE}
          error={error}
        />
      )}
      <CardBody className="flex items-center justify-between">
        <div className="overflow-hidden mr-1.5">
          <div className="flex items-center space-x-3">
            <div className="text-brand-500">
              <GetModuleIcon module={module.module} size={4} />
            </div>
            <div className="font-bold whitespace-nowrap">
              {getModule(module.module).name}
            </div>
          </div>
          <div className="text-sm text-gray-500 truncate">
            {module.contractAddress}
          </div>
        </div>
        {allowed ? (
          <Button
            variant="success"
            className="!space-x-0"
            icon={
              queryLoading || transactionLoading ? (
                <Spinner variant="success" size="xs" />
              ) : (
                <PlusIcon className="w-4 h-4" />
              )
            }
            onClick={() =>
              handleAllowance(module.currency, '10000000000', module.module)
            }
          >
            <span className="hidden ml-1.5 md:inline-block">Allow</span>
          </Button>
        ) : (
          <Button
            variant="warning"
            className="!space-x-0"
            icon={
              queryLoading || transactionLoading ? (
                <Spinner variant="warning" size="xs" />
              ) : (
                <MinusIcon className="w-4 h-4" />
              )
            }
            onClick={() => handleAllowance(module.currency, '0', module.module)}
          >
            <span className="hidden ml-1.5 md:inline-block">Revoke</span>
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default Module
