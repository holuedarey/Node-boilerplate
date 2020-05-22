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
      'customer',
      'freelancer',
     
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


const bookingRules = [
  {
    field: 'address',
    rules: 'required',
    messages: {
      required: 'Address is required.',
    },
  },
  {
    field: 'service_date',
    rules: 'required',
  },
  {
    field: 'service_time',
    rules: 'required',
  },
  {
    field: 'title',
    rules: 'required',
  },
  {
    field: 'description',
    rules: 'required',
  },
  {
    field: 'service',
    rules: 'required',
  },
  {
    field: 'category',
    rules: 'required',
  },
];

const categoryRules = [
  {
    field: 'title',
    rules: 'required',
    messages: {
      required: 'Title is required.',
    },
  },
  {
    field: 'description',
    rules: 'required',
  },
];

const setEmailRules = [
  {
    field: 'email',
    rules: 'required',
  },
];


export {
  registerRules, loginRules, resetPasswordRules, setEmailRules, changePasswordRules,  setRoleRules, bookingRules, categoryRules
};
