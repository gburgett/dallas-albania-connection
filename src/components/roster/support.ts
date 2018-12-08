import { ICollatedSmappData } from "./index";

export interface ISmappExportFields {
  name: string
  studentName: string
  amount: string
  designation: string
}

export function collateByDesignationNumber(exportData: ISmappExportFields[]): ICollatedSmappData {
  const ret: ICollatedSmappData = {}
  exportData.forEach(row => {
    const amt = parseAmount(row.amount)
    const current = ret[row.designation]

    ret[row.designation] = current ? current + amt : amt
  })
  return ret
}

const smappAmountRegex = /^\$([0-9\,\.]+)$/
function parseAmount(smappAmount: string): number {
  const matches = smappAmount.match(smappAmountRegex)
  if (!matches) {
    return parseFloat(smappAmount.replace(',', ''))
  }

  return parseFloat(matches[1].replace(',', ''))
}
