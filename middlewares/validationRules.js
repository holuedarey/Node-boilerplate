const termOnBoardRules = {
  data: {
    rules: 'required|arrayobject',
    arrayobject: {
      serial_no: 'required',
      type: 'required',
      model: 'required',
      condition: 'required',
    },
  },
};

const merchOnBoard2Rules = {
  mid: 'required',
  ussd_code: 'required',
  business_occupation_code: 'required',
  pan_account_nr: 'required',
  msc_rate: 'required',
  upper_limit: 'required',
  settlement_cycle: 'required|number',
  profile_compliance: {
    rules: 'required|object',
    object: {
      background_check: 'required',
      credit_check: 'required',
      physical_inspection: 'required',
      previous_agreement: 'required',
    },
  },
};

const merchOnBoardRules = {
  merchant_name: 'required',
  rc_number: 'required',
  bvn: 'required|number',
  merchant_address: 'required',
  merchant_email: 'email',
  merchant_phone: 'required',
  merchant_description: 'required',
  business_industry: 'required|array',
  merchant_account_name: 'required',
  merchant_account_nr: 'required',
  merchant_account_type: 'required',
  merchant_contacts: {
    rules: 'required|arrayobject',
    arrayobject: {
      contact_name: 'required',
      contact_designation: 'required',
      // contact_tel: 'required',
      contact_phone: 'required',
      contact_email: 'email',
    },
  },
  terminals: {
    rules: 'required|arrayobject',
    arrayobject: {
      location: 'required',
      contact_name: 'required',
      contact_phone: 'required',
      count: 'required|number',
    },
  },
  terminals_count: 'required|number',
  bank_branch: 'required',
  opening_hours: 'required',
  price_ranges: 'required',
  receive_sms: 'required',
};

const setRoleRules = {
  id: 'required',
  role: {
    rules: 'belongsto',
    belongsto: [
      'admin',
      'super admin',
      'account_rel_manager',
      'branch_op_manager',
      'branch_manager',
      'internal_control',
      'head_office',
    ],
  },
};

const registerRules = [
  {
    field: 'firstname',
    rules: 'required',
  },
  {
    field: 'lastname',
    rules: 'required',
  },
  {
    field: 'email',
    rules: 'required|email|unique',
    unique: 'User',
    messages: {
      required: 'Email address is required.',
      email: 'A valid email address is required.',
      unique: 'Email address already exists.',
    },
  },
  {
    field: 'password',
    rules: 'required|minlen',
    minlen: 8,
  },
  {
    field: 'role',
    rules: 'belongsto',
    belongsto: [
      'admin',
      'super admin',
      'account_rel_manager',
      'branch_op_manager',
      'branch_manager',
      'internal_control',
      'head_office',
    ],
  },
];

const resetPasswordRules = [
  {
    field: 'email',
    rules: 'required',
  },
];

const changePasswordRules = [
  {
    field: 'password',
    rules: 'required|minlen',
    minlen: 8,
  },
];

const loginRules = [
  {
    field: 'email',
    rules: 'required',
    messages: {
      required: 'Email address or Merchant ID is required.',
    },
  },
  {
    field: 'password',
    rules: 'required',
  },
];

const settlementConfigRules = [
  {
    field: 'merchant_id',
    rules: 'required',
  },
  {
    field: 'settlement_count',
    rules: 'required|number',
  },
  {
    field: 'added_msc',
    rules: 'number',
  },
];

const tSwitchRules = [
  {
    field: 'name',
    rules: 'required',
  },
  {
    field: 'headers',
    rules: 'required',
  },
  {
    field: 'transactionTime',
    rules: 'required',
  },
  {
    field: 'rrn',
    rules: 'required',
  },
  {
    field: 'terminalId',
    rules: 'required',
  },
  {
    field: 'merchantId',
    rules: 'required',
  },
  {
    field: 'amount',
    rules: 'required',
  },
  {
    field: 'maskedPan',
    rules: 'required',
  },
  {
    field: 'header_row_number',
    rules: 'required|number',
  },
];

const sSwitchRules = [
  {
    field: 'name',
    rules: 'required',
  },
  {
    field: 'headers',
    rules: 'required',
  },
  {
    field: 'transaction_date',
    rules: 'required',
  },
  {
    field: 'rrn',
    rules: 'required',
  },
  {
    field: 'terminal_id',
    rules: 'required',
  },
  {
    field: 'merchant_id',
    rules: 'required',
  },
  {
    field: 'transaction_amount',
    rules: 'required',
  },
  // {
  //   field: 'pan',
  //   rules: 'required',
  // },
  {
    field: 'header_row_number',
    rules: 'required|number',
  },
];

const accountNoConfigRules = [
  {
    field: 'account_no',
    rules: 'required|number',
  },
];

const onlineTermRules = [
  {
    field: 'online_seconds',
    rules: 'required|number',
  },
];

const activeTermRules = [
  {
    field: 'active_seconds',
    rules: 'required|number',
  },
];

const setEmailRules = [
  {
    field: 'email',
    rules: 'required',
  },
];

const merchantEmailRules = [
  {
    field: 'email',
    rules: 'required|email',
  },
  {
    field: 'merchant_id',
    rules: 'required',
  },
];

const addTransRules = {
  terminal_id: 'required',
  merchant_id: 'required',
  rrn: 'required',
  stan: 'required',
  pan: 'required',
  auth_code: 'required',
  response_code: 'required',
  response_msg: 'required',
  amount: 'required|number',
  transaction_date: 'required',
};

const termHealthRules = {
  lTxnAt: 'required',
  // simID: 'required',
  btemp: 'number',
  ctime: 'required',
  tmanu: 'required',
  // coms: 'required',
  tid: 'required',
  mid: 'required',
  // tmn: 'required',
  sv: 'required',
  // hb: 'required',
  // cs: 'required',
  bl: 'number',
  // ps: 'required',
  // ss: 'required',
  serial: 'required',
  ptad: 'required',
  imsi: 'required',
  // sim: 'required',
};

const configItemRules = {
  low_battery_level: 'number',
  low_network_level: 'number',
  notify_bad_printer: {
    rules: 'belongsto',
    belongsto: [true, false],
  },
  notify_inactive_terminal: {
    rules: 'belongsto',
    belongsto: [true, false],
  },
  notify_inactive_terminal_days: 'number',
};

const termSwitchRules = {
  merchant_name: 'required',
  merchant_email: 'required',
  merchant_phone: 'required',
  merchant_id: 'required',
  terminal_id: 'required',
  merchant_account_nr: 'required',
  merchant_contact: 'required',
  // mcc: 'required',
  // state_code: 'required',
  // merchant_account_name: 'required',
  ptsp: 'required',
  serial: 'required',
  device_name: 'required',
  app_name: 'required',
  // app_version: 'required',
  // network_type: 'required',
};

export {
  registerRules, loginRules, resetPasswordRules, settlementConfigRules,
  accountNoConfigRules, sSwitchRules, activeTermRules, onlineTermRules,
  setEmailRules, changePasswordRules, merchantEmailRules, merchOnBoardRules,
  setRoleRules, merchOnBoard2Rules, termOnBoardRules, tSwitchRules,
  addTransRules, termHealthRules, configItemRules, termSwitchRules,
};
