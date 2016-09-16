
$(document).on("mobileinit",function(){
  // jQuery.mobile.autoInitializePage = false;
});
$(document).ready(function() { 
  // jQuery.mobile.autoInitializePage = false;
  $("input[type='text']").on("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).select();
    $(this).focus();
    $(this).get(0).setSelectionRange(0, 9999);
  });

  $("input[type='text']").on("tap", function (e) {
   e.stopPropagation();
   e.preventDefault();
   $(this).focus();
   $(this).get(0).setSelectionRange(0, 9999);
  });

  $('.cash-formatting').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',wEmpty:'zero',mDec: '0'});
  $('.decimal-formatting').autoNumeric('init',{aSign:'',aDec:'.',aSep:',',wEmpty:'zero',mDec: '0'});
  $('.percentage-formatting').autoNumeric('init',{pSign:'s',aSign:'%',wEmpty:'zero',mDec: '0',mDec: '0'});
  $('.negative-cash-formatting').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',nBracket: '(,)',wEmpty:'zero',mDec: '0'});
  $('.negative-cash-decimal-formatting').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',nBracket: '(,)',wEmpty:'zero'});
  $('.days-formatting').autoNumeric('init',{aSign:' day(s)',aDec:'.',aSep:',',wEmpty:'zero',pSign:'s',mDec: '0'});
  $('.subtotal-field').autoNumeric('init',{aSign:'$ ',aDec:'.',aSep:',',wEmpty:'zero',mDec: '0'});

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
  
  //Prior Year Balance
  pyb_accounts_receivable = parseFloat($('#pyb_accounts_receivable').autoNumeric('get'))
  pyb_inventory = parseFloat($('#pyb_inventory').autoNumeric('get'))
  pyb_accounts_payable = parseFloat($('#pyb_accounts_payable').autoNumeric('get'))

  // Effects Fields
  red_cogs= parseFloat($('#red-cogs').autoNumeric('get'))/100 
  red_opr_exp = parseFloat($('#red-opr-ex').autoNumeric('get'))/100 
  inc_rev = parseFloat($('#inc-rev').autoNumeric('get'))/100 
  inc_sales_vol = parseFloat($('#inc-sales-vol').autoNumeric('get'))/100
  red_debt = parseFloat($('#red-debt').autoNumeric('get'))
  red_inv = parseFloat($('#red-inv').autoNumeric('get'))
  inc_creditor = parseFloat($('#inc-creditor').autoNumeric('get'))
  if(time_period != 0 && revenue != 0){
    //Indicators
    $('#gross_margin').autoNumeric('set', GrossMargin(revenue,cogs)*100)
    $('#ebit').autoNumeric('set', EBIT(revenue,cogs,opr_exp)*100)
    $('#ebitda').autoNumeric('set', EBITDA(revenue,cogs,opr_exp,non_cash_expense)*100)
    $('#wc_ebitda').autoNumeric('set', WorkingCapEbitda(acct_receivable,inventory,acct_payable,revenue,cogs,opr_exp,non_cash_expense,pyb_accounts_receivable,pyb_inventory,pyb_accounts_payable,time_period))
    $('#mcf_ebitda').autoNumeric('set', MarginalCFEbitda(time_period,revenue,cogs,acct_receivable,inventory,acct_payable,opr_exp,non_cash_expense,pyb_accounts_receivable,pyb_inventory,pyb_accounts_payable))
    DSO = DaysSalesOutstanding(acct_receivable,time_period,revenue)
    DIO = DaysInventoryOutstanding(inventory,time_period,cogs)
    DPO = DaysPayableOutstanding(acct_payable,time_period,cogs,opr_exp,non_cash_expense)
    $('#dso').autoNumeric('set', DSO)
    $('#dio').autoNumeric('set', DIO)
    $('#dpo').autoNumeric('set', DPO)

    $('#cash_conv').autoNumeric('set', CashConversionCycle(DSO,DIO,DPO))

    // The purpose of this array is to get the maximum value of the effects to get the relative percentages for the shading
    effect_array = [
    COGSEffect(cogs,inventory,acct_payable,red_cogs),
    OprExEffect(opr_exp,red_opr_exp,non_cash_expense),
    RevenueEffect(revenue,acct_receivable,inc_rev),
    SalesVolEffect(revenue,cogs,acct_receivable,inventory,acct_payable,inc_sales_vol),
    DebtorEffect(acct_receivable,DSO,red_debt,revenue,time_period),
    InventoryEffect(inventory,DIO,red_inv,cogs,time_period),
    CreditorEffect(acct_payable,DPO,inc_creditor,cogs,time_period, opr_exp,non_cash_expense)
    ]

    max_value = effect_array.reduce(max,0)

    //Effects calculations are here, can be refactored... done in a rush due to mingli presentation
      $('#red-cogs-effect').autoNumeric('set',effect_array[0])
      $('#red-opr-ex-effect').autoNumeric('set',effect_array[1])
      $('#inc-rev-effect').autoNumeric('set',effect_array[2])
      $('#inc-sales-vol-effect').autoNumeric('set',effect_array[3])
    if( red_debt != 0 ){
      $('#red-debt-effect').autoNumeric('set',effect_array[4])
    }
    if( red_inv != 0 ){
      $('#red-inv-effect').autoNumeric('set',effect_array[5])
    }
    if( inc_creditor != 0 ){
      $('#inc-creditor-effect').autoNumeric('set',effect_array[6])
    }
    if(red_debt != 0 || red_inv  != 0 || inc_creditor != 0 || red_cogs !=0 || red_opr_exp != 0 || inc_sales_vol != 0 || inc_rev !=0 ){
      $('#total-cf-change').autoNumeric('set',effect_array.reduce(add,0))
    }
    

    if (effect_array.length && (red_cogs != 0 || red_opr_exp != 0 || inc_rev != 0 || inc_sales_vol != 0 || red_debt != 0 || red_inv != 0 || inc_creditor != 0)) {
      for(i=0; i<effect_array.length; i++){
        EffectsBGRelativeChange($('#effects-section').find('.background-shading')[i],effect_array[i],max_value)
      }
    }
    else{
      $('.background-shading').css('background','linear-gradient(to right, #55A4DE '+ 0 +'%, white)')
    }

    // This area is for all the calculations for the after columns
    creditor_days_changed = CreditorDaysChanged(acct_payable,cogs,time_period,inc_creditor)
    debtor_days_changed = DebtorDaysChanged(acct_receivable,revenue,time_period,red_debt)
    inventory_days_changed = InventoryDaysChanged(inventory,cogs,time_period,red_inv)
    creditor_dollars = CreditorDollars(cogs,creditor_days_changed,time_period)
    debtor_dollars= DebtorDollars(revenue,debtor_days_changed,time_period)
    inventory_dollars= InventoryDollars(cogs,inventory_days_changed, time_period)


    revenue_after= RevenueAfter(revenue, inc_rev,inc_sales_vol)
    cogs_after= CostOfGoodsSoldAfter(cogs,red_cogs, inc_sales_vol)
    opr_exp_after= OperatingExpensesAfter(opr_exp, red_opr_exp)
    acct_receivable_after= AccountsReceivableAfter(acct_receivable,inc_rev ,inc_sales_vol, DSO, red_debt,revenue,time_period,cogs,inventory,acct_payable)
    inventory_after= InventoryAfter(inventory,cogs,inc_sales_vol,DIO ,red_cogs,time_period, red_inv)
    acct_payable_after= AccountsPayableAfter(acct_payable,red_cogs,inc_creditor,DPO,inc_sales_vol,cogs,opr_exp,non_cash_expense,time_period)
    non_cash_expense_after = NonCashExpenseAfter(non_cash_expense, red_opr_exp)



    // Set Key Business Indicators after column
    $('#revenue_after').autoNumeric('set',revenue_after)
    $('#cogs_after').autoNumeric('set',cogs_after)
    $('#opr_ex_after').autoNumeric('set',opr_exp_after)
    $('#accounts_receivable_after').autoNumeric('set',acct_receivable_after)
    $('#inventory_after').autoNumeric('set', inventory_after)
    $('#accounts_payable_after').autoNumeric('set',acct_payable_after)
    $('#non_cash_expense_after').autoNumeric('set',non_cash_expense_after)
    
    // Set Indicators after column
    $('#gross_margin_after').autoNumeric('set', GrossMargin(revenue_after,cogs_after)*100)
    $('#ebit_after').autoNumeric('set', EBIT(revenue_after,cogs_after,opr_exp_after)*100)
    $('#ebitda_after').autoNumeric('set', EBITDA(revenue_after,cogs_after,opr_exp_after,non_cash_expense)*100)
    $('#wc_ebitda_after').autoNumeric('set', WorkingCapEbitda(acct_receivable_after,inventory_after,acct_payable_after,revenue_after,cogs_after,opr_exp_after,non_cash_expense_after,pyb_accounts_receivable,pyb_inventory,pyb_accounts_payable,time_period))
    $('#mcf_ebitda_after').autoNumeric('set', MarginalCFEbitda(time_period ,revenue_after ,cogs_after ,acct_receivable_after ,inventory_after ,acct_payable_after ,opr_exp_after ,non_cash_expense_after ,pyb_accounts_receivable,pyb_inventory,pyb_accounts_payable))
    DSO_after = DaysSalesOutstanding(acct_receivable_after,time_period,revenue_after)
    DIO_after = DaysInventoryOutstanding(inventory_after,time_period,cogs_after)
    DPO_after = DaysPayableOutstanding(acct_payable_after,time_period,cogs_after,opr_exp_after,non_cash_expense_after)
    $('#dso_after').autoNumeric('set', DSO_after)
    $('#dio_after').autoNumeric('set', DIO_after)
    $('#dpo_after').autoNumeric('set', DPO_after)
    $('#cash_conv_after').autoNumeric('set', CashConversionCycle(DSO_after,DIO_after,DPO_after))

}
 
 

  if(inc_sales_vol === 0 && inc_rev === 0){
    $('#revenue_after').autoNumeric('set',revenue)
    if(red_debt == 0) {
      $('#accounts_receivable_after').autoNumeric('set',acct_receivable)
    }
  }
  if(inc_sales_vol === 0 && red_cogs === 0){
    $('#cogs_after').autoNumeric('set',cogs)
    if (red_inv == 0){
      $('#inventory_after').autoNumeric('set', inventory)
    }
    if(inc_creditor ==0){
      $('#accounts_payable_after').autoNumeric('set',acct_payable)
    }
  }
  if(red_opr_exp === 0){
    $('#opr_ex_after').autoNumeric('set',opr_exp)
    $('#non_cash_expense_after').autoNumeric('set',non_cash_expense)
  }

}

// this function ensures that if the cash flow effects is 0%, then the relevant after columns will remain 0%


// This function changes the length of each effect's background shading in the effects column to be relative to the largest value
function EffectsBGRelativeChange(target,value,max){
  ratio = (value/max)
  shading_percentage =  ratio > 0.95 ? 95 : ratio*100
  $(target).css('background','linear-gradient(to right, #55A4DE '+ shading_percentage +'%, white)')
}

function ResetBGShading(){

}
function add(a,b){
  return a+b;
}

function max(a,b){
  // Returns the larger value
  return a > b ? a : b
}

