function repayment(x) {
  return x + 0.07 * x;
}

let arr = [1000, 900, 800, 700, 600, 500, 400];

for (let e in arr) {
  console.log(
    repayment(arr[e]) +
      "\t" +
      "at: " +
      arr[e] +
      "\t" +
      "in: " +
      (1800 - repayment(arr[e]))
  );
}
