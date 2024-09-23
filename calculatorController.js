app.controller("calculatorController", function ($scope) {
      $scope.buttons = [
            { label: "AC", operator: "ac" },
            { label: "DEL", operator: "del" },
            { label: "+/-", operator: "sign" },
            { label: "/", operator: "div" },

            { label: "7", value: 7 },
            { label: "8", value: 8 },
            { label: "9", value: 9 },
            { label: "x", operator: "mul" },

            { label: "4", value: 4 },
            { label: "5", value: 5 },
            { label: "6", value: 6 },
            { label: "-", operator: "mi" },

            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "+", operator: "plus" },

            { label: ".", operator: "dec" },
            { label: "0", value: 0 },
            { label: "=", operator: "equal" },
      ];

      // Actions
      const AC = "ac";
      const DELETE = "del";
      const SIGNAL = "sign";
      const MULTIPLY = "mul";
      const MINUS = "mi";
      const PLUS = "plus";
      const DECIMAL = "dec";
      const EQUAL = "equal";
      const DIVIDE = "div";

      const calculate = (a, b, operator) => {
            a = parseFloat(a);
            b = parseFloat(b);
            switch (operator) {
                  case MULTIPLY:
                        return a * b;
                  case MINUS:
                        return a - b;
                  case PLUS:
                        return a + b;
                  case DIVIDE:
                        return b !== 0 ? a / b : "Error";
                  default:
                        return b;
            }
      };

      $scope.expression = "";
      $scope.previousExpression = "";
      let waitingForOperand = false;
      let firstOperand = null;
      let currentOperator = "";

      $scope.handleButtonClicked = (button) => {
            if (button.operator === SIGNAL) {
                  $scope.previousExpression = $scope.expression;
            } else if (button.operator !== EQUAL && button.operator !== AC && button.operator !== DELETE) {
                  $scope.previousExpression += button.label;
            }

            if (button.value !== undefined) {
                  if (waitingForOperand) {
                        $scope.expression = button.value.toString();
                        waitingForOperand = false;
                  } else {
                        $scope.expression += button.value.toString();
                  }
            } else {
                  switch (button.operator) {
                        case DELETE:
                              $scope.expression = $scope.expression.length === 1 ? "0" : $scope.expression.slice(0, -1);
                              $scope.previousExpression = $scope.expression;
                              break;
                        case AC:
                              $scope.expression = $scope.previousExpression = currentOperator = "";
                              firstOperand = null;
                              waitingForOperand = false;
                              break;
                        case SIGNAL:
                              $scope.expression = $scope.expression
                                    ? (-parseFloat($scope.expression)).toString()
                                    : $scope.expression;
                              $scope.previousExpression = $scope.expression;
                              break;
                        case EQUAL:
                              if (currentOperator && firstOperand !== null) {
                                    $scope.expression = calculate(
                                          firstOperand,
                                          $scope.expression,
                                          currentOperator
                                    )?.toString();
                                    firstOperand = null;
                                    currentOperator = "";
                              }
                              break;
                        case DECIMAL:
                              if (!$scope.expression.includes(".")) {
                                    $scope.expression += ".";
                              }
                              if (!$scope.previousExpression.includes(".")) {
                                    $scope.previousExpression += ".";
                              }
                              break;

                        default:
                              if (firstOperand === null) {
                                    firstOperand = $scope.expression;
                              } else {
                                    firstOperand = calculate(firstOperand, $scope.expression, currentOperator);
                                    $scope.expression = firstOperand.toString();
                              }

                              currentOperator = button.operator;
                              waitingForOperand = true;
                              break;
                  }
            }
      };
});
