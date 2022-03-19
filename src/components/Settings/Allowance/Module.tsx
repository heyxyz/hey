import { gql, useLazyQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
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
  module: any
}

const Module: React.FC<Props> = ({ module }) => {
  const [allowed, setAllowed] = useState<boolean>(module.allowance === '0x00')
  const [generateAllowanceQuery, { loading: queryLoading, error }] =
    useLazyQuery(GENERATE_ALLOWANCE_QUERY)

  const [{ loading: transactionLoading }, sendTransaction] = useTransaction()

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
      }).then(({ error }) => {
        if (!error) {
          setAllowed(false)
          toast.success('Module enabled successfully!')
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
        <div>
          <div className="flex items-center space-x-3">
            <div className="text-brand-500">
              <GetModuleIcon module={module.module} size={4} />
            </div>
            <div className="font-bold">{getModule(module.module).name}</div>
          </div>
          <div className="text-sm text-gray-500">{module.contractAddress}</div>
        </div>
        {allowed ? (
          <Button
            variant="success"
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
            Allow
          </Button>
        ) : (
          <Button
            variant="warning"
            icon={
              queryLoading || transactionLoading ? (
                <Spinner variant="success" size="xs" />
              ) : (
                <MinusIcon className="w-4 h-4" />
              )
            }
            onClick={() => handleAllowance(module.currency, '0', module.module)}
          >
            Revoke
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default Module
