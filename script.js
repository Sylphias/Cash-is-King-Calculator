
$(document).ready(function() { 

  $('#calculate').click(Calculate())

 });
function Calculate(){
  time_period = parseFloat($('#time_period').val())
  revenue = parseFloat($('#revenue').val())
  cogs = parseFloat($('#cogs').val())
  opr_exp= parseFloat($('#opr_ex').val())
  acct_receivable = parseFloat($('#accounts_receivable').val())
  inventory = parseFloat($('#inventory').val())
  acct_payable = parseFloat($('#accounts_payable').val())
  non_cash_expense= parseFloat($('#non_cash_expense').val())

  $('#gross_margin').text(GrossMargin(revenue,cogs))
  $('#ebit').text(EBIT(revenue,cogs,opr_exp,non_cash_expense))
  $('#ebitda').text(EBITDA(revenue,cogs,opr_exp))
  $('#wc_rev').text(WorkingCapRev(acct_receivable,inventory,acct_payable,time_period,revenue,cogs,opr_exp))
  $('#wc_ebitda').text(WorkingCapEbitda(acct_receivable,inventory,acct_payable,time_period,revenue,cogs,opr_exp))
  $('#mcf_rev').text(MarginalCFRevenue(parseFloat($('#gross_margin').text()),parseFloat($('#wc_rev').text())))
  $('#mcf_ebitda').text(MarginalCFEbitda(parseFloat($('#ebitda').text()),parseFloat($('#wc_ebitda').text())))
  $('#dso').text(DaysSalesOutstanding(acct_receivable,time_period,revenue))
  $('#dio').text(DaysInventoryOutstanding(inventory,time_period,cogs))
  $('#dpo').text(DaysPayableOutstanding(acct_payable,time_period,cogs))
  $('#cash_conv').text(CashConversionCycle(parseFloat($('#dso').text()),parseFloat($('#dio').text()),parseFloat($('#dpo').text())))
}