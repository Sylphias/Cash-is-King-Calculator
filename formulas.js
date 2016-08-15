//var revenue,time_period, cost_of_goods_sold, opr_expense, accounts_receivable, accounts_payable, non_cash_expense

//Gross Margin  
function GrossMargin(revenue, cogs){
 return (((revenue-cogs)*100)/revenue)/100
} 

//Net Profit before Tax (EBIT)  
function EBIT(revenue,cogs,opr_expense,non_cash_expense){
  return (((revenue - cogs - opr_expense - non_cash_expense)*100)/revenue)/100
}   
//Net Profit before Tax, Depreciation and Amortization (EBITDA)  
function EBITDA(revenue,cogs,opr_expense){
  return (((revenue - cogs - opr_expense)*100)/revenue)/100
}  

//Investment in Working Capital - per $1 Revenue 
function WorkingCapRev(accounts_receivable, inventory, accounts_payable, time_period, revenue, cogs, opr_expense){
  return (((accounts_receivable + inventory- accounts_payable)*time_period*100)/(revenue*12))/100
}   

//Investment in Working Capital - per $1 EBITDA  
function WorkingCapEbitda( accounts_receivable, inventory, accounts_payable, time_period,revenue,cogs,opr_expense){
  return ((accounts_receivable+inventory-accounts_payable)*time_period)/((revenue - cogs - opr_expense)*12)
}  

//Marginal Cash Flow per $1 Revenue
function MarginalCFRevenue(gross_margin, investment_wc_rev){
  return gross_margin-investment_wc_rev
}    

//Marginal Cash Flow per EBITDA  
function MarginalCFEbitda(ebitda, investment_wc_ebitda){
  return ebitda - investment_wc_ebitda
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
function DaysPayableOutstanding(accounts_payable,time_period, cogs){
  return (accounts_payable*365*time_period)/(cogs*12)
}

function CashConversionCycle(DSO,DIO,DPO){
  return DSO+DIO-DPO

}


//These functions are for the after column
function Revenue(revenue, rev_increase,increase_sales_vol){
  return revenue + (revenue * rev_increase) + (revenue *increase_sales_vol)
}

function CostOfGoodsSold(cogs, reduce_cogs, increase_sales_vol){
  return cogs - (cogs*reduce_cogs)+ (cogs*increase_sales_vol)
}

function OperatingExpenses(opr_expense,reduce_opr_expense){
  return opr_expense - (opr_expense*reduce_opr_expense)
}

function AccountsReceivable(accounts_receivable, rev_increase,debtor_dollars,increase_sales_vol){
  return accounts_receivable+(accounts_receivable*rev_increase)-(accounts_receivable*debtor_dollars) +(accounts_receivable*increase_sales_vol)
}

function Inventory(inventory,reduce_cogs, inventory_dollar, increase_sales_vol){
  return inventory-(inventory*reduce_cogs)-(inventory-inventory_dollar)+(inventory*increase_sales_vol)
}

function AccountsPayable(accounts_payable,reduce_cogs,creditor_dollars,increase_sales_vol){
  return accounts_payable-(accounts_payable*reduce_cogs)-(accounts_payable-creditor_dollars)+(accounts_payable*increase_sales_vol)
}


// These formulas are for the effects column
function COGSEffect(cogs,inventory,accounts_payable,reduce_cogs){
  return (cogs +inventory -accounts_payable)*reduce_cogs
}

function OprExEffect(opr_expense,reduce_opr_expense){
  return opr_expense*reduce_opr_expense
}

function RevenueEffect(revenue,accounts_receivable,rev_increase){
  return (revenue - accounts_receivable)*rev_increase
}

function SalesVolEffect(revenue,cogs,accounts_receivable,inventory,accounts_payable,increase_sales_vol){
  return (revenue-cogs- accounts_receivable - inventory+accounts_payable)*increase_sales_vol
}

function DebtorEffect(accounts_receivable,DSO,debtor_days,revenue){
  return accounts_receivable-((DSO- debtor_days)*revenue/365)
}

function InventoryEffect(inventory,DIO, inventory_days,cogs){
  return inventory-((DIO-inventory_days)*cogs/365)
}

function CreditorEffect(accounts_payable,DPO,creditor_days,cogs){
  return accounts_payable-((DPO-creditor_days)*cogs/365)
}

// Change to cash flow is a sum of the effects column
