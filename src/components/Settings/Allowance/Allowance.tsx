import { gql, useLazyQuery } from '@apollo/client'
import { CardBody } from '@components/UI/Card'
import { ApprovedAllowanceAmount } from '@generated/types'
import React from 'react'
import { useTransaction } from 'wagmi'

import Module from './Module'

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
        (item: ApprovedAllowanceAmount, index: number) => (
          <Module key={index} module={item} />
        )
      )}
    </CardBody>
  )
}

export default Allowance
