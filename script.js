'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-06-02T14:11:59.604Z',
    '2022-06-03T17:01:17.194Z',
    '2022-06-07T23:36:17.929Z',
    '2022-06-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Display account diposit/withdrawal
const displayMovements = function (acc, sorted) {
  containerMovements.innerHTML = '';

  // Sorting the movements array
  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Update date
    const displayDate = updateDate(false, acc.locale, acc.movementsDates[i]);

    // Format movement numbers
    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance of an account
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  // Format Balance
  const formattedBal = formatCurr(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedBal}`;
};

// Display deposit/withdrawal summary
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  // Format Currency
  labelSumIn.textContent = formatCurr(income, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * (acc.interestRate / 100))
    .filter((int) => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
  // console.log(interest);
};

// Creat Username for all the account owner
const CreateUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
CreateUserName(accounts);

/////////////////////////////////////////////////
// Functions
// Update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Update Dates
const updateDate = function (
  longFormat,
  locale,
  movDates = new Date().toISOString()
) {
  const date = new Date(movDates);

  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (longFormat) {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // return based on different country date format
    return new Intl.DateTimeFormat(locale, options).format(date);
  } else {
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Format Currency
const formatCurr = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

/*
// Logout Timer
const startLogoutTimer = function () {
  let time = 10;

  // Call the time every second
  const timer = setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  }, 1000);
};
*/

// Logout Timer
// Note: setInterval calls its callback function after 1sec because of the interval we set.
// So  we see a 1sec delay in timer
// To prevent that, we put the callback function in a seperate function (tick()) and immediately call it.
// This way tick() gets called immediately along with setInterval
// Then timer is called each time after 1sec as usual
const startLogoutTimer = function () {
  const tick = function () {
    // Format seconds in minutes & seconds
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      // Clear the timer, otherwise after 0sec, it continues towards negative time
      clearInterval(timer);

      // Hide UI (logout)
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 300;

  // Call the callback function immediately with setInterval
  tick();
  // Call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

/////////////////////////////////////////////////
// Event handlers
// Login
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  // Find acount based on username
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // Login if pin is correct
  // Number() = + -> + converts string to number
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date & time
    // We are calling the updateDate() with longFormat=true and the 2nd parameter (date) will be 'new Date()' (because we want current time) in default
    labelDate.textContent = updateDate(true, currentAccount.locale);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // Remove cursor from input fields after login
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Start Logout Timer
    // Note: We are returning timer from startLogoutTimer() so that we can if timer from previous login exist. If so we clear it so that after new login new timer will be set
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';

  // Remove cursor from input fields after login
  inputTransferTo.blur();
  inputTransferAmount.blur();

  // console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Transfering amount
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update Date in movementsDate array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// Request for loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // Check if the requested amount is atmost 10% of any deposit
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    // Loan will be approved after 3 seconds
    setTimeout(() => {
      // Add loan amount
      currentAccount.movements.push(amount);

      // Update Date in movementsDate array
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
  }

  // Clear input fields
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Check if it's the owner of the account
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';

  // Remove cursor from input fields after login
  inputCloseUsername.blur();
  inputClosePin.blur();
});

// Sorting Deposit/withdrawal (movements)
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
