
$(document).ready(function() { 

  $("input[type='text']").on("click", function () {
   $(this).select();
  });


  $('.cash-formatting').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',wEmpty:'zero'});
  $('.percentage-formatting').autoNumeric('init',{pSign:'s',aSign:'%',wEmpty:'zero',mDec: '0'})
  $('.negative-cash-formatting').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',nBracket: '(,)',wEmpty:'zero'})
  $('.days-formatting').autoNumeric('init',{aSign:' day(s)',aDec:'.',aSep:',',wEmpty:'zero',pSign:'s',mDec: '0'})
  $('.subtotal-field').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',wEmpty:'zero'});

  // Focus and blur to trigger formatting js
  $('.form-control').val(0).focus().blur()
  $('#time_period').val(12)
  $('.form-control').change(function(){
    Calculate();
  });
 });
function Calculate(){

  time_period = parseFloat($('#time_period').val())
  revenue = parseFloat($('#revenue').autoNumeric('get'))
  cogs = parseFloat($('#cogs').autoNumeric('get'))
  opr_exp= parseFloat($('#opr_ex').autoNumeric('get'))
  acct_receivable = parseFloat($('#accounts_receivable').autoNumeric('get'))
  inventory = parseFloat($('#inventory').autoNumeric('get'))
  acct_payable = parseFloat($('#accounts_payable').autoNumeric('get'))
  non_cash_expense= parseFloat($('#non_cash_expense').autoNumeric('get'))

  $('#gross_margin').autoNumeric('set', GrossMargin(revenue,cogs))
  $('#ebit').autoNumeric('set', EBIT(revenue,cogs,opr_exp,non_cash_expense))
  $('#ebitda').autoNumeric('set', EBITDA(revenue,cogs,opr_exp))
  $('#wc_rev').autoNumeric('set', WorkingCapRev(acct_receivable,inventory,acct_payable,time_period,revenue,cogs,opr_exp))
  $('#wc_ebitda').autoNumeric('set', WorkingCapEbitda(acct_receivable,inventory,acct_payable,time_period,revenue,cogs,opr_exp))
  $('#mcf_rev').autoNumeric('set', MarginalCFRevenue(parseFloat($('#gross_margin').autoNumeric('get')),parseFloat($('#wc_rev').autoNumeric('get'))))
  $('#mcf_ebitda').autoNumeric('set', MarginalCFEbitda(parseFloat($('#ebitda').autoNumeric('get')),parseFloat($('#wc_ebitda').autoNumeric('get'))))
  $('#dso').autoNumeric('set', DaysSalesOutstanding(acct_receivable,time_period,revenue))
  $('#dio').autoNumeric('set', DaysInventoryOutstanding(inventory,time_period,cogs))
  $('#dpo').autoNumeric('set', DaysPayableOutstanding(acct_payable,time_period,cogs))
  $('#cash_conv').autoNumeric('set', CashConversionCycle(parseFloat($('#dso').autoNumeric('get')),parseFloat($('#dio').autoNumeric('get')),parseFloat($('#dpo').autoNumeric('get'))))
}