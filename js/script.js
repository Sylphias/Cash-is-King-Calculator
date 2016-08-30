
$(document).ready(function() { 

  $("input[type='text']").on("click", function (e) {
    e.preventDefault();
    $(this).select();
  });
  $("input[type='text']").on("tap", function (e) {
   e.preventDefault();
   $(this).select();
  });
  $('.cash-formatting').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',wEmpty:'zero'});
  $('.decimal-formatting').autoNumeric('init',{aSign:'',aDec:'.',aSep:',',wEmpty:'zero'});
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

  $('.add-value-btn').click(function(){
    target_value = $(this).closest('.row').find('input');
    target_value.autoNumeric('set', parseFloat(target_value.autoNumeric('get'))+1)
    Calculate()
  });

  $('.minus-value-btn').click(function(){
    target_value = $(this).closest('.row').find('input');
    target_value.autoNumeric('set', parseFloat(target_value.autoNumeric('get'))-1)
    Calculate()
  });
 });

// This function runs all the formulas for the calculator
function Calculate(){
  //Business info fields
  time_period = parseFloat($('#time_period').val())
  revenue = parseFloat($('#revenue').autoNumeric('get'))
  cogs = parseFloat($('#cogs').autoNumeric('get'))
  opr_exp= parseFloat($('#opr_ex').autoNumeric('get'))
  acct_receivable = parseFloat($('#accounts_receivable').autoNumeric('get'))
  inventory = parseFloat($('#inventory').autoNumeric('get'))
  acct_payable = parseFloat($('#accounts_payable').autoNumeric('get'))
  non_cash_expense= parseFloat($('#non_cash_expense').autoNumeric('get'))
  
  // Effects Fields
  red_cogs= parseFloat($('#red-cogs').autoNumeric('get'))/100 
  red_opr_ex = parseFloat($('#red-opr-ex').autoNumeric('get'))/100 
  inc_rev = parseFloat($('#inc-rev').autoNumeric('get'))/100 
  inc_sales_vol = parseFloat($('#inc-sales-vol').autoNumeric('get'))/100
  red_debt = parseFloat($('#red-debt').autoNumeric('get'))
  red_inv = parseFloat($('#red-inv').autoNumeric('get'))
  inc_creditor = parseFloat($('#inc-creditor').autoNumeric('get'))

  //Indicators
  $('#gross_margin').autoNumeric('set', GrossMargin(revenue,cogs)*100)
  $('#ebit').autoNumeric('set', EBIT(revenue,cogs,opr_exp,non_cash_expense)*100)
  $('#ebitda').autoNumeric('set', EBITDA(revenue,cogs,opr_exp)*100)
  $('#wc_rev').autoNumeric('set', WorkingCapRev(acct_receivable,inventory,acct_payable,time_period,revenue,cogs,opr_exp)*100)
  $('#wc_ebitda').autoNumeric('set', WorkingCapEbitda(acct_receivable,inventory,acct_payable,time_period,revenue,cogs,opr_exp)*100)
  $('#mcf_rev').autoNumeric('set', MarginalCFRevenue(parseFloat($('#gross_margin').autoNumeric('get')),parseFloat($('#wc_rev').autoNumeric('get'))))
  $('#mcf_ebitda').autoNumeric('set', MarginalCFEbitda(parseFloat($('#ebitda').autoNumeric('get')),revenue,cogs,acct_receivable,inventory,acct_payable))
  $('#dso').autoNumeric('set', DaysSalesOutstanding(acct_receivable,time_period,revenue))
  $('#dio').autoNumeric('set', DaysInventoryOutstanding(inventory,time_period,cogs))
  $('#dpo').autoNumeric('set', DaysPayableOutstanding(acct_payable,time_period,cogs))
  DSO = parseFloat($('#dso').autoNumeric('get'))
  DIO = parseFloat($('#dio').autoNumeric('get'))
  DPO = parseFloat($('#dpo').autoNumeric('get'))
  $('#cash_conv').autoNumeric('set', CashConversionCycle(DSO,DIO,DPO))

  // The purpose of this array is to get the maximum value of the effects to get the relative percentages for the shading
  effect_array = [
  COGSEffect(cogs,inventory,acct_payable,red_cogs),
  OprExEffect(opr_exp,red_opr_ex),
  RevenueEffect(revenue,acct_receivable,inc_rev),
  SalesVolEffect(revenue,cogs,acct_receivable,inventory,acct_payable,inc_sales_vol),
  DebtorEffect(acct_receivable,DSO,red_debt,revenue,time_period),
  InventoryEffect(inventory,DIO,red_inv,cogs,time_period),
  CreditorEffect(acct_payable,DPO,inc_creditor,cogs,time_period)
  ]

  max_value = effect_array.reduce(max,0)

  //Effects
  $('#red-cogs-effect').autoNumeric('set',effect_array[0])
  $('#red-opr-ex-effect').autoNumeric('set',effect_array[1])
  $('#inc-rev-effect').autoNumeric('set',effect_array[2])
  $('#inc-sales-vol-effect').autoNumeric('set',effect_array[3])
  $('#red-debt-effect').autoNumeric('set',effect_array[4])
  $('#red-inv-effect').autoNumeric('set',effect_array[5])
  $('#inc-creditor-effect').autoNumeric('set',effect_array[6])
  $('#total-cf-change').autoNumeric('set',effect_array.reduce(add,0))
  if (effect_array.length) {
    for(i=0; i<effect_array.length; i++){
      EffectsBGRelativeChange($('#effects-section').find('.background-shading')[i],effect_array[i],max_value)
    }
  } 

}

// This function changes the length of each effect's background shading in the effects column to be relative to the largest value
function EffectsBGRelativeChange(target,value,max){
  ratio = (value/max)
  shading_percentage =  ratio > 0.95 ? 95 : ratio*100
  $(target).css('background','linear-gradient(to right, #55A4DE '+ shading_percentage +'%, white)')
}

function add(a,b){
  return a+b;
}

function max(a,b){
  // Returns the larger value
  return a > b ? a : b
}

function getCssValuePrefix()
{
    var rtrnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++)
    {
        // Attempt to set the style
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background)
        {
            rtrnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
}

