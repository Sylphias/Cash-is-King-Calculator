//var revenue,time_period, cost_of_goods_sold, opr_expense, accounts_receivable, accounts_payable, non_cash_expense

//Gross Margin  
function GrossMargin(revenue, cogs){
 return (((revenue-cogs)*100)/revenue)/100
} 

//Net Profit before Tax (EBIT)  
function EBIT(revenue,cogs,opr_expense){
  return (((revenue - cogs - opr_expense )*100)/revenue)/100
}   
//Net Profit before Tax, Depreciation and Amortization (EBITDA)  
function EBITDA(revenue,cogs,opr_expense, non_cash_expense){
  return (((revenue - cogs - opr_expense+ non_cash_expense)*100)/revenue)/100
}  

//Investment in Working Capital - per $1 Revenue 
function WorkingCapRev(accounts_receivable, inventory, accounts_payable, time_period, revenue, cogs, opr_expense){
  return (((accounts_receivable + inventory- accounts_payable)*time_period*100)/(revenue*12))/100
}   

//Investment in Working Capital - per $1 EBITDA  
function WorkingCapEbitda( accounts_receivable, inventory, accounts_payable, revenue, cogs, opr_expense, non_cash_expense,pyb_accounts_receivable, pyb_inventory, pyb_accounts_payable, months){
  return ((accounts_receivable+inventory-accounts_payable)-(pyb_accounts_receivable+pyb_inventory-pyb_accounts_payable))/((revenue - cogs - opr_expense + non_cash_expense)*12/months)
}  

//Marginal Cash Flow per $1 Revenue
function MarginalCFRevenue(gross_margin, investment_wc_rev){
  return gross_margin/100-investment_wc_rev
}    

//Marginal Cash Flow per EBITDA  
function MarginalCFEbitda(months, revenue,cogs,accounts_receivable,inventory,accounts_payable,opr_exp, non_cash_expense, pyr_accounts_receivable, pyr_inventory, pyr_accounts_payable){
  return (revenue - cogs - opr_exp + non_cash_expense-((accounts_receivable + inventory - accounts_payable)-(pyr_accounts_receivable + pyr_inventory - pyr_accounts_payable)))/((revenue - cogs - opr_exp + non_cash_expense)*12/months)
}  
//DSO
function DaysSalesOutstanding(accounts_receivable,time_period,revenue){
  return (accounts_receivable*365*time_period)/(revenue*12)
}
//DIO
function DaysInventoryOutstanding(inventory,time_period,cogs){
  return (inventory*365*time_period)/(cogs*12)
}
//DPO
function DaysPayableOutstanding(accounts_payable,time_period, cogs, opr_exp,non_cash_expense){
  return (accounts_payable*365*time_period)/((cogs + opr_exp - non_cash_expense)*12)
}

function CashConversionCycle(DSO,DIO,DPO){
  return DSO+DIO-DPO

}

// These formulas are for the effects column
function COGSEffect(cogs,inventory,accounts_payable,reduce_cogs){
  return (cogs +inventory -accounts_payable)*reduce_cogs
}

function OprExEffect(opr_expense,reduce_opr_expense,non_cash_expense){
  return (opr_expense-non_cash_expense)*reduce_opr_expense
}

function RevenueEffect(revenue,accounts_receivable,rev_increase){
  return (revenue - accounts_receivable)*rev_increase
}

function SalesVolEffect(revenue,cogs,accounts_receivable,inventory,accounts_payable,increase_sales_vol){
  return (revenue-cogs- accounts_receivable - inventory+accounts_payable)*increase_sales_vol
}

function DebtorEffect(accounts_receivable,DSO,debtor_days,revenue,months){
  return accounts_receivable-((DSO - debtor_days)* revenue/365 * 12 / months)
}

function InventoryEffect(inventory,DIO, inventory_days,cogs,months){
  return inventory-((DIO-inventory_days)* cogs / 365 * 12 / months)
}

function CreditorEffect(accounts_payable,DPO,inc_creditors,cogs,months, opr_ex, non_cash_expense){
  return accounts_payable-((DPO-inc_creditors)* (cogs + opr_ex - non_cash_expense)/ 365 * 12 / months )
}

// Change to cash flow is a sum of the effects column


//These functions are for the after column
function RevenueAfter(revenue, rev_increase,increase_sales_vol){
  return revenue + (revenue * rev_increase) + (revenue *increase_sales_vol)
}

function CostOfGoodsSoldAfter(cogs, decrease_cogs, increase_sales_vol){
  return cogs - (cogs*decrease_cogs)+ (cogs*increase_sales_vol)
}

function OperatingExpensesAfter(opr_expense,reduce_opr_expense){
  return opr_expense - (opr_expense*reduce_opr_expense)
}

function AccountsReceivableAfter(accounts_receivable, rev_increase, increase_sales_vol, DSO, red_debtors, revenue, months, cogs, inventory, accounts_payable){
  return accounts_receivable+(accounts_receivable-((DSO+red_debtors)*(revenue/365)*(12/months))+(revenue-cogs-accounts_receivable-inventory+accounts_payable)*increase_sales_vol+(revenue-accounts_receivable)*rev_increase)
}

function InventoryAfter(inventory, cogs, increase_sales_vol, DIO, reduce_cogs,months,red_inventory){
  return inventory+(-red_cogs*inventory)+(increase_sales_vol*inventory)+inventory-((DIO+red_inventory)*(cogs/365)*(12/months))
}

function AccountsPayableAfter(accounts_payable,decrease_cogs,increase_creditors,DPO,increase_sales_vol,cogs,opr_expense,non_cash_expenses,months){
  return accounts_payable+(accounts_payable*decrease_cogs)+(accounts_payable*increase_sales_vol)+accounts_payable-((DPO-increase_creditors)*(cogs+opr_expense-non_cash_expenses)/365*12/months)
}

function NonCashExpenseAfter(non_cash_expense, reduce_opr_expense){
  return non_cash_expense-(non_cash_expense*reduce_opr_expense)
}

// Other Indicator formulas
// red means reduce
function CreditorDollars(cogs,creditors_days_changed,time_period){
  return cogs*(creditors_days_changed/365)*(time_period/12)
}

function CreditorDaysChanged(accounts_payable,cogs,time_period,inc_creditors){
  return ((accounts_payable/cogs)*(time_period/12)*365)+inc_creditors
}

function DebtorDollars(revenue,debtor_days_changed,time_period){
  return revenue*(debtor_days_changed/365)*(time_period/12)
}

function DebtorDaysChanged(accounts_receivable,revenue,time_period,red_debtors){
  return ((accounts_receivable/revenue)*(time_period/12)*365)-red_debtors
}

function InventoryDollars(cogs,inventory_days_changed,time_period){
  return cogs*(inventory_days_changed/365)*(time_period/12)
}

function InventoryDaysChanged(inventory,cogs,time_period,red_inventory){
  return ((inventory/cogs)*(time_period/12)*365)-red_inventory
}
