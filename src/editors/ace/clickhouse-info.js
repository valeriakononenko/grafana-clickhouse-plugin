/**
 *
 * @returns {boolean}
 */
export default function aceCHInfo() {
    if (window['ace']) {
        ace.define("ace/mode/clickhouse_info", ["require", "exports", "module"], function (require, exports, module) {
            "use strict";
    
            var arithmeticFunctionsCompletions = [
                {
                    "name": "plus",
                    "def": "plus(a, b)",
                    "docText": "a + b operator\n" +
                      "Calculates the sum of the numbers.\n" +
                      "You can also add integer numbers with a date or date and time.\n" +
                      "In the case of a date, adding an integer means adding the corresponding number of days.\n" +
                      "For a date with time, it means adding the corresponding number of seconds."
                },
                {
                    "name": "minus",
                    "def": "minus(a, b)",
                    "docText": "a - b operator\n" +
                      "Calculates the difference. The result is always signed. \n" +
                      "You can also calculate whole numbers from a date or date with time.\n" +
                      "In the case of a date, adding an integer means adding the corresponding number of days.\n" +
                      "For a date with time, it means adding the corresponding number of seconds."
                },
                {
                    "name": "multiply",
                    "def": "multiply(a, b)",
                    "docText": "a * b operator\n" +
                      "Calculates the product of the numbers."
                },
                {
                    "name": "divide",
                    "def": "divide(a, b)",
                    "docText": "a / b operator\n" +
                      "Calculates the quotient of the numbers. The result type is always a floating-point type.\n" +
                      "It is not integer division. For integer division, use the `intDiv` function. \n" +
                      "When dividing by zero you get `inf`, `-inf`, or `nan`."
                },
                {
                    "name": "intDiv",
                    "def": "intDiv(a, b)",
                    "docText": "Calculates the quotient of the numbers. Divides into integers, rounding down " +
                      "(by the absolute value).\n" +
                      "An exception is thrown when dividing by zero or when dividing a minimal negative number " +
                      "by minus one."
                },
                {
                    "name": "intDivOrZero",
                    "def": "intDivOrZero(a, b)",
                    "docText": "Calculates the quotient of the numbers. Divides into integers, rounding down " +
                      "(by the absolute value).\n" +
                      "Returns zero when dividing by zero or when dividing a minimal negative number by minus one."
                },
                {
                    "name": "modulo",
                    "def": "modulo(a, b)",
                    "docText": "a % b operator\n" +
                      "Calculates the remainder after division.\n" +
                      "If arguments are floating-point numbers, they are pre-converted to integers by dropping the " +
                      "decimal portion.\n" +
                      "The remainder is taken in the same sense as in C++. Truncated division is used for negative " +
                      "numbers.\n" +
                      "An exception is thrown when dividing by zero or when dividing a minimal negative number by " +
                      "minus one."
                },
                {
                    "name": "moduloOrZero",
                    "def": "moduloOrZero(a, b)",
                    "docText": "a % b operator\n" +
                      "Calculates the remainder after division.\n" +
                      "If arguments are floating-point numbers, they are pre-converted to integers by dropping the " +
                      "decimal portion.\n" +
                      "The remainder is taken in the same sense as in C++. Truncated division is used for negative " +
                      "numbers.\n" +
                      "Returns zero when the divisor is zero."
                },
                {
                    "name": "negate",
                    "def": "negate(a)",
                    "docText": "-a operator\n" +
                      "Calculates a number with the reverse sign. The result is always signed."
                },
                {
                    "name": "abs",
                    "def": "abs(a)",
                    "docText": "Calculates the absolute value of the number (a). " +
                      "That is, if a \\< 0, it returns -a.\n" +
                      "For unsigned types it doesn’t do anything.\n" +
                      "For signed integer types, it returns an unsigned number."
                },
                {
                    "name": "gcd",
                    "def": "gcd(a, b)",
                    "docText": "Returns the greatest common divisor of the numbers.\n" +
                      "An exception is thrown when dividing by zero or when dividing a minimal negative number by " +
                      "minus one."
                },
                {
                    "name": "lcm",
                    "def": "lcm(a, b)",
                    "docText": "Returns the least common multiple of the numbers.\n" +
                      "An exception is thrown when dividing by zero or when dividing a minimal negative number by " +
                      "minus one."
                }
            ];
            
            var comparisonFunctionsCompletions = [
                {
                    "name": "equals",
                    "def": "equals(a, b)",
                    "docText": "a = b and a == b operator"
                },
                {
                    "name": "notEquals",
                    "def": "notEquals(a, b)",
                    "docText": "a != b and a \\<> b operator"
                },
                {
                    "name": "less",
                    "def": "less(a, b)",
                    "docText": "a < b"
                },
                {
                    "name": "lessOrEquals",
                    "def": "lessOrEquals(a, b)",
                    "docText": "a <= b"
                },
                {
                    "name": "greater",
                    "def": "greater(a, b)",
                    "docText": "a > b"
                },
                {
                    "name": "greaterOrEquals",
                    "def": "greaterOrEquals(a, b)",
                    "docText": "a >= b"
                },
            ];
            
            var logicalFunctionsCompletions = [
                {
                    "name": "and",
                    "def": "and(a, b)",
                    "docText": "a and b"
                },
                {
                    "name": "or",
                    "def": "or(a, b)",
                    "docText": "a or b"
                },
                {
                    "name": "not",
                    "def": "not(a)",
                    "docText": "!a\nnot a"
                },
                {
                    "name": "xor",
                    "def": "xor(a, b)",
                    "docText": "a xor b"
                }
            ];
            
            var typeConversionFunctionsCompletions = [
                {
                    "name": "toInt8",
                    "def": "toInt8(expr)",
                    "docText": "Converts an input value to the Int8 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for the NaN and Inf arguments is undefined. " +
                      "Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toInt16",
                    "def": "toInt16(expr)",
                    "docText": "Converts an input value to the Int16 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for the NaN and Inf arguments is undefined. " +
                      "Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toInt32",
                    "def": "toInt32(expr)",
                    "docText": "Converts an input value to the Int32 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for the NaN and Inf arguments is undefined. " +
                      "Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toInt64",
                    "def": "toInt64(expr)",
                    "docText": "Converts an input value to the Int64 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for the NaN and Inf arguments is undefined. " +
                      "Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toInt8OrZero",
                    "def": "toInt8OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int8.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toInt16OrZero",
                    "def": "toInt16OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int16.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toInt32OrZero",
                    "def": "toInt32OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int32.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toInt64OrZero",
                    "def": "toInt64OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int64.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toInt8OrNull",
                    "def": "toInt8OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int8.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toInt16OrNull",
                    "def": "toInt16OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int16.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toInt32OrNull",
                    "def": "toInt32OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int32.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toInt64OrNull",
                    "def": "toInt64OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into Int64.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toUInt8",
                    "def": "toUInt8(expr)",
                    "docText": "Converts an input value to the UInt8 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for negative arguments and for the NaN and Inf arguments is " +
                      "undefined. If you pass a string with a negative number, for example '-32', ClickHouse raises " +
                      "an exception. Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toUInt16",
                    "def": "toUInt16(expr)",
                    "docText": "Converts an input value to the UInt16 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for negative arguments and for the NaN and Inf arguments is " +
                      "undefined. If you pass a string with a negative number, for example '-32', ClickHouse raises " +
                      "an exception. Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toUInt32",
                    "def": "toUInt32(expr)",
                    "docText": "Converts an input value to the UInt32 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for negative arguments and for the NaN and Inf arguments is " +
                      "undefined. If you pass a string with a negative number, for example '-32', ClickHouse raises " +
                      "an exception. Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toUInt64",
                    "def": "toUInt64(expr)",
                    "docText": "Converts an input value to the UInt64 data type.\n" +
                      "expr — Expression returning a number or a string with the decimal representation of a number. " +
                      "Binary, octal, and hexadecimal representations of numbers are not supported. " +
                      "Leading zeroes are stripped.\n" +
                      "Functions use rounding towards zero, meaning they truncate fractional digits of numbers.\n" +
                      "The behavior of functions for negative arguments and for the NaN and Inf arguments is " +
                      "undefined. If you pass a string with a negative number, for example '-32', ClickHouse raises " +
                      "an exception. Remember about numeric conversions issues, when using the functions."
                },
                {
                    "name": "toUInt8OrZero",
                    "def": "toUInt8OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt8.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toUInt16OrZero",
                    "def": "toUInt16OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt16.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toUInt32OrZero",
                    "def": "toUInt32OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt32.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toUInt64OrZero",
                    "def": "toUInt64OrZero(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt64.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toUInt8OrNull",
                    "def": "toUInt8OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt8.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toUInt16OrNull",
                    "def": "toUInt16OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt16.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toUInt32OrNull",
                    "def": "toUInt32OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt32.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toUInt64OrNull",
                    "def": "toUInt64OrNull(str)",
                    "docText": "It takes an argument of type String and tries to parse it into UInt64.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toFloat32",
                    "def": "toFloat32(exp)",
                    "docText": "Converts an input value to the Float32 data type."
                },
                {
                    "name": "toFloat64",
                    "def": "toFloat64(exp)",
                    "docText": "Converts an input value to the Float64 data type."
                },
                {
                    "name": "toFloat32OrZero",
                    "def": "toFloat32OrZero(str)",
                    "docText": "Converts a string value to the Float32 data type.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toFloat64OrZero",
                    "def": "toFloat64OrZero(str)",
                    "docText": "Converts a string value to the Float64 data type.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toFloat32OrNull",
                    "def": "toFloat32OrNull(str)",
                    "docText": "Converts a string value to the Float32 data type.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toFloat64OrNull",
                    "def": "toFloat64OrNull(str)",
                    "docText": "Converts a string value to the Float64 data type.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toDate",
                    "def": "toDate(v)",
                    "docText": "Converts a string value or unix timestamp to the Date data type."
                },
                {
                    "name": "toDateOrZero",
                    "def": "toDateOrZero(v)",
                    "docText": "Converts a string value or unix timestamp to the Date data type.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toDateOrNull",
                    "def": "toDateOrNull(v)",
                    "docText": "Converts a string value or unix timestamp to the Date data type.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toDateTime",
                    "def": "toDate(v)",
                    "docText": "Converts a string value or unix timestamp to the DateTime data type."
                },
                {
                    "name": "toDateTimeOrZero",
                    "def": "toDateTimeOrZero(v)",
                    "docText": "Converts a string value or unix timestamp to the DateTime data type.\n" +
                      "If failed, returns 0."
                },
                {
                    "name": "toDateTimeOrNull",
                    "def": "toDateTimeOrNull(v)",
                    "docText": "Converts a string value or unix timestamp to the DateTime data type.\n" +
                      "If failed, returns NULL."
                },
                {
                    "name": "toDecimal32",
                    "def": "toDecimal32(value, S)",
                    "docText": "Converts value to the Decimal data type with precision of S.\n" +
                      "The value can be a number or a string.\n" +
                      "The S (scale) parameter specifies the number of decimal places.."
                },
                {
                    "name": "toDecimal64",
                    "def": "toDecimal64(value, S)",
                    "docText": "Converts value to the Decimal data type with precision of S.\n" +
                      "The value can be a number or a string.\n" +
                      "The S (scale) parameter specifies the number of decimal places.."
                },
                {
                    "name": "toDecimal128",
                    "def": "toDecimal128(value, S)",
                    "docText": "Converts value to the Decimal data type with precision of S.\n" +
                      "The value can be a number or a string.\n" +
                      "The S (scale) parameter specifies the number of decimal places.."
                },
                {
                    "name": "toDecimal32OrNull",
                    "def": "toDecimal32OrNull(expr, S)",
                    "docText": "Converts an input string to a Nullable(Decimal(P,S)) data type value."
                },
                {
                    "name": "toDecimal64OrNull",
                    "def": "toDecimal64OrNull(expr, S)",
                    "docText": "Converts an input string to a Nullable(Decimal(P,S)) data type value."
                },
                {
                    "name": "toDecimal128OrNull",
                    "def": "toDecimal128OrNull(expr, S)",
                    "docText": "Converts an input string to a Nullable(Decimal(P,S)) data type value."
                },
                {
                    "name": "toDecimal32OrZero",
                    "def": "toDecimal32OrZero(expr, S)",
                    "docText": "Converts an input string to a Decimal(P,S) data type value or 0 with S decimal places."
                },
                {
                    "name": "toDecimal64OrZero",
                    "def": "toDecimal64OrZero(expr, S)",
                    "docText": "Converts an input string to a Decimal(P,S) data type value or 0 with S decimal places."
                },
                {
                    "name": "toDecimal128OrZero",
                    "def": "toDecimal128OrZero(expr, S)",
                    "docText": "Converts an input string to a Decimal(P,S) data type value or 0 with S decimal places."
                },
                {
                    "name": "toString",
                    "def": "toString(v [, time_zone])",
                    "docText": "Functions for converting between numbers, strings (but not fixed strings), dates, " +
                      "and dates with times.\n" +
                      "All these functions accept one argument.\n" +
                      "\n" +
                      "Additionally, the toString function of the DateTime argument can take a second String " +
                      "argument containing the name of the time zone. Example: Asia/Yekaterinburg In this case, " +
                      "the time is formatted according to the specified time zone."
                },
                {
                    "name": "toFixedString",
                    "def": "toFixedString(s, N)",
                    "docText": "Converts a String type argument to a FixedString(N) type " +
                      "(a string with fixed length N). N must be a constant.\n" +
                      "If the string has fewer bytes than N, it is passed with null bytes to the right. " +
                      "If the string has more bytes than N, an exception is thrown."
                },
                {
                    "name": "toStringCutToZero",
                    "def": "toStringCutToZero(s)",
                    "docText": "Accepts a String or FixedString argument. " +
                      "Returns a String that is cut to a first null byte occurrence."
                },
                {
                    "name": "reinterpretAsUInt8",
                    "def": "reinterpretAsUInt8(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsUInt16",
                    "def": "reinterpretAsUInt16(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsUInt32",
                    "def": "reinterpretAsUInt32(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsUInt64",
                    "def": "reinterpretAsUInt64(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsInt8",
                    "def": "reinterpretAsInt8(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsInt16",
                    "def": "reinterpretAsInt16(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsInt32",
                    "def": "reinterpretAsInt32(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsInt64",
                    "def": "reinterpretAsInt64(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsFloat32",
                    "def": "reinterpretAsFloat32(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsFloat64",
                    "def": "reinterpretAsFloat64(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsDate",
                    "def": "reinterpretAsDate(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsDateTime",
                    "def": "reinterpretAsDateTime(v)",
                    "docText": "Accepts a string and interprets the bytes placed at the beginning of the string as " +
                      "a number in host order (little endian). If the string isn’t long enough, the function works " +
                      "as if the string is padded with the necessary number of null bytes. If the string is longer " +
                      "than needed, the extra bytes are ignored. A date is interpreted as the number of days since " +
                      "the beginning of the Unix Epoch, and a date with time is interpreted as the number of seconds " +
                      "since the beginning of the Unix Epoch."
                },
                {
                    "name": "reinterpretAsString",
                    "def": "reinterpretAsString(v)",
                    "docText": "This function accepts a number or date or date with time, and returns a string " +
                      "containing bytes representing the corresponding value in host order (little endian). " +
                      "Null bytes are dropped from the end. For example, a UInt32 type value of 255 is a string that " +
                      "is one byte long."
                },
                {
                    "name": "reinterpretAsFixedString",
                    "def": "reinterpretAsFixedString(v)",
                    "docText": "This function accepts a number or date or date with time, and returns a FixedString " +
                      "containing bytes representing the corresponding value in host order (little endian). " +
                      "Null bytes are dropped from the end. For example, a UInt32 type value of 255 is a " +
                      "FixedString that is one byte long."
                },
                {
                    "name": "CAST",
                    "def": "CAST(x, t)",
                    "docText": "Converts ‘x’ to the ‘t’ data type.\n" +
                      "The syntax CAST(x AS t) is also supported.\n" +
                      "Conversion to FixedString(N) only works for arguments of type String or FixedString(N).\n" +
                      "Type conversion to Nullable and back is supported."
                },
                {
                    "name": "toIntervalYear",
                    "def": "toIntervalYear(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalQuarter",
                    "def": "toIntervalQuarter(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalMonth",
                    "def": "toIntervalMonth(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalWeek",
                    "def": "toIntervalWeek(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalDay",
                    "def": "toIntervalDay(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalHour",
                    "def": "toIntervalHour(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalMinute",
                    "def": "toIntervalMinute(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "toIntervalSecond",
                    "def": "toIntervalSecond(number)",
                    "docText": "Converts a Number type argument to an Interval data type.\n" +
                      "number — Duration of interval. Positive integer number."
                },
                {
                    "name": "parseDateTimeBestEffort",
                    "def": "parseDateTimeBestEffort(time_string [, time_zone])",
                    "docText": "Converts a date and time in the String representation to DateTime data type.\n" +
                      "The function parses ISO 8601, RFC 1123 - 5.2.14 RFC-822 Date and Time Specification, " +
                      "ClickHouse’s and some other date and time formats.\n" +
                      "\n" +
                      "time_string — String containing a date and time to convert. String.\n" +
                      "time_zone — Time zone. The function parses time_string according to the time zone. String.\n" +
                      "\n" +
                      "Returned time_string converted to the DateTime data type."
                },
                {
                    "name": "parseDateTimeBestEffortUS",
                    "def": "parseDateTimeBestEffortUS(time_string [, time_zone])",
                    "docText": "Converts a date and time in the String representation to DateTime data type.\n" +
                      "The function parses US style (MM/DD/YYYY etc) date and time formats.\n" +
                      "\n" +
                      "time_string — String containing a date and time to convert. String.\n" +
                      "time_zone — Time zone. The function parses time_string according to the time zone. String.\n" +
                      "\n" +
                      "Returned time_string converted to the DateTime data type."
                },
                {
                    "name": "parseDateTimeBestEffortOrNull",
                    "def": "parseDateTimeBestEffortOrNull(time_string [, time_zone])",
                    "docText": "Converts a date and time in the String representation to DateTime data type.\n" +
                      "\n" +
                      "time_string — String containing a date and time to convert. String.\n" +
                      "time_zone — Time zone. The function parses time_string according to the time zone. String.\n" +
                      "\n" +
                      "Returned time_string converted to the DateTime data type.\n" +
                      "It returns NULL when it encounters a date format that cannot be processed."
                },
                {
                    "name": "parseDateTimeBestEffortOrZero",
                    "def": "parseDateTimeBestEffortOrZero(time_string [, time_zone])",
                    "docText": "Converts a date and time in the String representation to DateTime data type.\n" +
                      "\n" +
                      "time_string — String containing a date and time to convert. String.\n" +
                      "time_zone — Time zone. The function parses time_string according to the time zone. String.\n" +
                      "\n" +
                      "Returned time_string converted to the DateTime data type.\n" +
                      "It returns 0 when it encounters a date format that cannot be processed."
                },
                {
                    "name": "toLowCardinality",
                    "def": "toLowCardinality(expr)",
                    "docText": "Converts input parameter to the LowCardinality version of same data type.\n" +
                      "To convert data from the LowCardinality data type use the CAST function.\n" +
                      "For example, CAST(x as String). It returns 0 when it encounters a date format that cannot be " +
                      "processed.\n" +
                      "\n" +
                      "expr — Expression resulting in one of the supported data types."
                },
                {
                    "name": "toUnixTimestamp64Milli",
                    "def": "toUnixTimestamp64Milli(value)",
                    "docText": "Converts a DateTime64 to a Int64 value with fixed sub-second precision. " +
                      "Input value is scaled up or down appropriately depending on it precision. " +
                      "Please note that output value is a timestamp in UTC, not in timezone of DateTime64.\n" +
                      "\n" +
                      "value — DateTime64 value with any precision."
                },
                {
                    "name": "toUnixTimestamp64Micro",
                    "def": "toUnixTimestamp64Micro(value)",
                    "docText": "Converts a DateTime64 to a Int64 value with fixed sub-second precision. " +
                      "Input value is scaled up or down appropriately depending on it precision. " +
                      "Please note that output value is a timestamp in UTC, not in timezone of DateTime64.\n" +
                      "\n" +
                      "value — DateTime64 value with any precision."
                },
                {
                    "name": "toUnixTimestamp64Nano",
                    "def": "toUnixTimestamp64Nano(value)",
                    "docText": "Converts a DateTime64 to a Int64 value with fixed sub-second precision. " +
                      "Input value is scaled up or down appropriately depending on it precision. " +
                      "Please note that output value is a timestamp in UTC, not in timezone of DateTime64.\n" +
                      "\n" +
                      "value — DateTime64 value with any precision."
                },
                {
                    "name": "fromUnixTimestamp64Milli",
                    "def": "fromUnixTimestamp64Milli(value [, tz])",
                    "docText": "Converts an Int64 to a DateTime64 value with fixed sub-second precision and " +
                      "optional timezone. Input value is scaled up or down appropriately depending on it’s " +
                      "precision. Please note that input value is treated as UTC timestamp, not timestamp at " +
                      "given (or implicit) timezone.\n" +
                      "\n" +
                      "value — Int64 value with any precision.\n" +
                      "tz — String (optional) timezone name of the result."
                },
                {
                    "name": "fromUnixTimestamp64Micro",
                    "def": "fromUnixTimestamp64Micro(value [, tz])",
                    "docText": "Converts an Int64 to a DateTime64 value with fixed sub-second precision and " +
                      "optional timezone. Input value is scaled up or down appropriately depending on it’s " +
                      "precision. Please note that input value is treated as UTC timestamp, not timestamp at " +
                      "given (or implicit) timezone.\n" +
                      "\n" +
                      "value — Int64 value with any precision.\n" +
                      "tz — String (optional) timezone name of the result."
                },
                {
                    "name": "fromUnixTimestamp64Nano",
                    "def": "fromUnixTimestamp64Nano(value [, tz])",
                    "docText": "Converts an Int64 to a DateTime64 value with fixed sub-second precision and " +
                      "optional timezone. Input value is scaled up or down appropriately depending on it’s " +
                      "precision. Please note that input value is treated as UTC timestamp, not timestamp at " +
                      "given (or implicit) timezone.\n" +
                      "\n" +
                      "value — Int64 value with any precision.\n" +
                      "tz — String (optional) timezone name of the result."
                },
            ];
            
            var timeFunctionsCompletions = [
                {
                    "name": "toTimeZone",
                    "def": "toTimeZone(time, timezone)",
                    "docText": "Converts time or date and time to the specified time zone.\n" +
                      "\n" +
                      "time - DateTime or DateTime64 value\n" +
                      "timezone - string value of timezone"
                },
                {
                    "name": "toYear",
                    "def": "toYear(v)",
                    "docText": "Converts a date or date with time to a UInt16 number containing the year number (AD)."
                },
                {
                    "name": "toQuarter",
                    "def": "toQuarter(v)",
                    "docText": "Converts a date or date with time to a UInt8 number containing the quarter number."
                },
                {
                    "name": "toMonth",
                    "def": "toMonth(v)",
                    "docText": "Converts a date or date with time to a UInt8 number containing the month number (1-12)."
                },
                {
                    "name": "toDayOfYear",
                    "def": "toDayOfYear(v)",
                    "docText": "Converts a date or date with time to a UInt16 number containing the number of the " +
                      "day of the year (1-366)."
                },
                {
                    "name": "toDayOfMonth",
                    "def": "toDayOfMonth(v)",
                    "docText": "Converts a date or date with time to a UInt8 number containing the number of the day " +
                      "of the month (1-31)."
                },
                {
                    "name": "toDayOfWeek",
                    "def": "toDayOfWeek(v)",
                    "docText": "Converts a date or date with time to a UInt8 number containing the number of the day " +
                      "of the week (Monday is 1, and Sunday is 7)."
                },
                {
                    "name": "toHour",
                    "def": "toHour(v)",
                    "docText": "Converts a date with time to a UInt8 number containing the number of the hour in " +
                      "24-hour time (0-23). \n" +
                      "\n" +
                      "This function assumes that if clocks are moved ahead, it is by one hour and occurs at 2 a.m., " +
                      "and if clocks are moved back, it is by one hour and occurs at 3 a.m.\n" +
                      "(which is not always true - even in Moscow the clocks were once changed at a different time)."
                },
                {
                    "name": "toMinute",
                    "def": "toMinute(v)",
                    "docText": "Converts a date with time to a UInt8 number containing the number of the minute of " +
                      "the hour (0-59)."
                },
                {
                    "name": "toSecond",
                    "def": "toSecond(v)",
                    "docText": "Converts a date with time to a UInt8 number containing the number of the second " +
                      "in the minute (0-59). \n" +
                      "Leap seconds are not accounted for."
                },
                {
                    "name": "toUnixTimestamp",
                    "def": "toUnixTimestamp(v, [timezone])",
                    "docText": "For DateTime argument: converts value to its internal numeric representation " +
                      "(Unix Timestamp).\n" +
                      "For String argument: parse datetime from string according to the timezone " +
                      "(optional second argument, server timezone is used by default) " +
                      "and returns the corresponding unix timestamp.\n" + "" +
                      "For Date argument: the behaviour is unspecified."
                },
                {
                    "name": "toStartOfYear",
                    "def": "toStartOfYear(v)",
                    "docText": "Rounds down a date or date with time to the first day of the year. \n" +
                      " Returns the date."
                },
                {
                    "name": "toStartOfISOYear",
                    "def": "toStartOfISOYear(v)",
                    "docText": "Rounds down a date or date with time to the first day of ISO year.\n" +
                      "Returns the date."
                },
                {
                    "name": "toStartOfQuarter",
                    "def": "toStartOfQuarter(v)",
                    "docText": "Rounds down a date or date with time to the first day of the quarter.\n" +
                      "The first day of the quarter is either 1 January, 1 April, 1 July, or 1 October.\n" +
                      "Returns the date."
                },
                {
                    "name": "toStartOfMonth",
                    "def": "toStartOfMonth(v)",
                    "docText": "Rounds down a date or date with time to the first day of the month.\n" +
                      "Returns the date."
                },
                {
                    "name": "toMonday",
                    "def": "toMonday(v)",
                    "docText": "Rounds down a date or date with time to the nearest Monday.\n" +
                      "Returns the date."
                },
                {
                    "name": "toStartOfWeek",
                    "def": "toStartOfWeek(t[,mode])",
                    "docText": "Rounds down a date or date with time to the nearest Sunday or Monday by mode.\n" +
                      "Returns the date.\n" +
                      "The mode argument works exactly like the mode argument to toWeek(). " +
                      "For the single-argument syntax, a mode value of 0 is used."
                },
                {
                    "name": "toStartOfDay",
                    "def": "toStartOfDay(v)",
                    "docText": "Rounds down a date with time to the start of the day."
                },
                {
                    "name": "toStartOfHour",
                    "def": "toStartOfHour(v)",
                    "docText": "Rounds down a date with time to the start of the hour."
                },
                {
                    "name": "toStartOfMinute",
                    "def": "toStartOfMinute(v)",
                    "docText": "Rounds down a date with time to the start of the minute."
                },
                {
                    "name": "toStartOfSecond",
                    "def": "toStartOfSecond(value[, timezone])",
                    "docText": "Truncates sub-seconds.\n" +
                      "\n" +
                      "value — Date and time. DateTime64.\n" +
                      "timezone — Timezone for the returned value (optional). " +
                      "If not specified, the function uses the timezone of the value parameter. String."
                },
                {
                    "name": "toStartOfFiveMinute",
                    "def": "toStartOfFiveMinute(v)",
                    "docText": "Rounds down a date with time to the start of the five-minute interval."
                },
                {
                    "name": "toStartOfTenMinutes",
                    "def": "toStartOfTenMinutes(v)",
                    "docText": "Rounds down a date with time to the start of the ten-minute interval."
                },
                {
                    "name": "toStartOfFifteenMinutes",
                    "def": "toStartOfFifteenMinutes(v)",
                    "docText": "Rounds down a date with time to the start of the fifteen-minute interval."
                },
                {
                    "name": "toStartOfInterval",
                    "def": "toStartOfInterval(time_or_data, INTERVAL x unit [, time_zone])",
                    "docText": "This is a generalization of other functions named toStartOf*.\n" +
                      "For example,\n" +
                      "toStartOfInterval(t, INTERVAL 1 year) returns the same as toStartOfYear(t)"
                },
                {
                    "name": "toTime",
                    "def": "toTime(v)",
                    "docText": "Converts a date with time to the date of the start of the Unix Epoch, " +
                      "while preserving the time."
                },
                {
                    "name": "toRelativeYearNum",
                    "def": "toRelativeYearNum(v)",
                    "docText": "Converts a date with time or date to the number of the year, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toRelativeQuarterNum",
                    "def": "toRelativeQuarterNum(v)",
                    "docText": "Converts a date with time or date to the number of the quarter, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toRelativeMonthNum",
                    "def": "toRelativeMonthNum(v)",
                    "docText": "Converts a date with time or date to the number of the month, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toRelativeWeekNum",
                    "def": "toRelativeWeekNum(v)",
                    "docText": "Converts a date with time or date to the number of the week, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toRelativeDayNum",
                    "def": "toRelativeDayNum(v)",
                    "docText": "Converts a date with time or date to the number of the day, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toRelativeHourNum",
                    "def": "toRelativeHourNum(v)",
                    "docText": "Converts a date with time or date to the number of the hour, starting from a certain " +
                      "fixed point in the past."
                },
                {
                    "name": "toRelativeMinuteNum",
                    "def": "toRelativeMinuteNum(v)",
                    "docText": "Converts a date with time or date to the number of the minute, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toRelativeSecondNum",
                    "def": "toRelativeSecondNum(v)",
                    "docText": "Converts a date with time or date to the number of the second, " +
                      "starting from a certain fixed point in the past."
                },
                {
                    "name": "toISOYear",
                    "def": "toISOYear(v)",
                    "docText": "Converts a date or date with time to a UInt16 number containing the ISO Year number."
                },
                {
                    "name": "toISOWeek",
                    "def": "toISOWeek(v)",
                    "docText": "Converts a date or date with time to a UInt8 number containing the ISO Week number."
                },
                {
                    "name": "toWeek",
                    "def": "toWeek(date[, mode, timezone])",
                    "docText": "Returns the week number for date or datetime.\n" +
                      "The two-argument form of toWeek() enables you to specify\n" +
                      "whether the week starts on Sunday or Monday and\n" +
                      "whether the return value should be in the range from 0 to 53 or from 1 to 53.\n" +
                      "If the mode argument is omitted, the default mode is 0.\n" +
                      "\n" +
                      "toISOWeek()is a compatibility function that is equivalent to toWeek(date,3).\n" +
                      "\n" +
                      "date – Date or DateTime.\n" +
                      "mode – Optional parameter, Range of values is [0,9], default is 0.\n" +
                      "timezone – Optional parameter, it behaves like any other conversion function."
                },
                {
                    "name": "toYearWeek",
                    "def": "toYearWeek(date[, mode])",
                    "docText": "Returns year and week for a date.\n" +
                      "The year in the result may be different from the year in the date argument for the first " +
                      "and the last week of the year.\n" +
                      "\n" +
                      "toISOYear()is a compatibility function that is equivalent to intDiv(toYearWeek(date,3),100).\n" +
                      "\n" +
                      "date – Date or DateTime.\n" +
                      "mode – Optional parameter, Range of values is [0,9], default is 0.\n"
                },
                {
                    "name": "now",
                    "def": "now()",
                    "docText": "Accepts zero arguments and returns the current time at one of the moments of request " +
                      "execution.\n" +
                      "This function returns a constant, even if the request took a long time to complete."
                },
                {
                    "name": "today",
                    "def": "today()",
                    "docText": "Accepts zero arguments and returns the current date at one of the moments of request " +
                      "execution.\n" +
                      "The same as ‘toDate(now())’."
                },
                {
                    "name": "yesterday",
                    "def": "yesterday()",
                    "docText": "Accepts zero arguments and returns yesterday`s date at one of the moments of request " +
                      "execution.\n" +
                      "The same as `today() - 1`."
                },
                {
                    "name": "timeSlot",
                    "def": "timeSlot(time[, timezone])",
                    "docText": "Rounds the time to the half hour.\n" +
                      "This function is specific to Yandex.Metrica, since half an hour is the minimum amount of time " +
                      "for breaking a session into two sessions if a tracking tag shows a single user’s consecutive " +
                      "page views that differ in time by strictly more than this amount.\n" +
                      "This means that tuples (the tag ID, user ID, and time slot) can be used to search for page " +
                      "views that are included in the corresponding session.\n" +
                      "\n" +
                      "time - Date or DateTime.\n" +
                      "timezone - Optional string with timezone name."
                },
                {
                    "name": "toYYYYMM",
                    "def": "toYYYYMM(time)",
                    "docText": "Converts a date or date with time to a UInt32 number containing the year and month " +
                      "number (YYYY * 100 + MM)."
                },
                {
                    "name": "toYYYYMMDD",
                    "def": "toYYYYMMDD(time)",
                    "docText": "Converts a date or date with time to a UInt32 number containing the year and month " +
                      "number (YYYY * 10000 + MM * 100 + DD)."
                },
                {
                    "name": "toYYYYMMDDhhmmss",
                    "def": "toYYYYMMDDhhmmss(time)",
                    "docText": "Converts a date or date with time to a UInt64 number containing the year and month " +
                      "number (YYYY * 10000000000 + MM * 100000000 + DD * 1000000 + hh * 10000 + mm * 100 + ss)."
                },
                {
                    "name": "addYears",
                    "def": "addYears(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of years"
                },
                {
                    "name": "addMonths",
                    "def": "addMonths(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of months"
                },
                {
                    "name": "addWeeks",
                    "def": "addWeeks(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of weeks"
                },
                {
                    "name": "addDays",
                    "def": "addDays(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of days"
                },
                {
                    "name": "addHours",
                    "def": "addHours(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of hours"
                },
                {
                    "name": "addMinutes",
                    "def": "addMinutes(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of minutes"
                },
                {
                    "name": "addSeconds",
                    "def": "addSeconds(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of seconds"
                },
                {
                    "name": "addQuarters",
                    "def": "addQuarters(time, interval)",
                    "docText": "Adds a Date/DateTime interval to a Date/DateTime and then return the Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of quarters"
                },
                {
                    "name": "subtractYears",
                    "def": "subtractYears(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of years"
                },
                {
                    "name": "subtractMonths",
                    "def": "subtractMonths(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of months"
                },
                {
                    "name": "subtractWeeks",
                    "def": "subtractWeeks(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of weeks"
                },
                {
                    "name": "subtractDays",
                    "def": "subtractDays(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of days"
                },
                {
                    "name": "subtractHours",
                    "def": "subtractHours(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of hours"
                },
                {
                    "name": "subtractMinutes",
                    "def": "subtractMinutes(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of minutes"
                },
                {
                    "name": "subtractSeconds",
                    "def": "subtractSeconds(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of seconds"
                },
                {
                    "name": "subtractQuarters",
                    "def": "subtractQuarters(time, interval)",
                    "docText": "Subtracts a Date/DateTime interval to a Date/DateTime and then return the " +
                      "Date/DateTime\n" +
                      "time - Date or DateTime\n" +
                      "interval - number of quarters"
                },
                {
                    "name": "dateDiff",
                    "def": "dateDiff(unit, startDate, endDate, [timezone])",
                    "docText": "Returns the difference between startdate and enddate expressed in unit.\n" +
                      "unit — Time unit, in which the returned value is expressed. String.\n" +
                      "\tSupported values: second, minute, hour, day, week, month, quarter, year\n" +
                      "startDate — The first time value to compare. Date or DateTime.\n" +
                      "endDate — The second time value to compare. Date or DateTime.\n" +
                      "timezone — Optional parameter. If specified, it is applied to both startDate and endDate. " +
                      "If not specified, timezones of startDate and endDate are used. " +
                      "If they are not the same, the result is unspecified."
                },
                {
                    "name": "timeSlots",
                    "def": "timeSlots(startTime, duration[, size])",
                    "docText": "For a time interval starting at ‘StartTime’ and continuing for ‘Duration’ seconds, " +
                      "it returns an array of moments in time, consisting of points from this interval rounded down " +
                      "to the ‘Size’ in seconds.\n" +
                      "‘Size’ is an optional parameter: a constant UInt32, set to 1800 by default.\n"
                },
                {
                    "name": "formatDateTime",
                    "def": "formatDateTime(time, format[, timezone])",
                    "docText": "Function formats a Time according given Format string.\n" +
                      "N.B.: Format is a constant expression, e.g. you can not have multiple formats for single " +
                      "result column.\n" +
                      "\n" +
                      "time - Date or DateTime\n" +
                      "format - String For ex.: %C or %d\n" +
                      "timezone - Optional String"
                },
                {
                    "name": "FROM_UNIXTIME",
                    "def": "FROM_UNIXTIME(unixTime[, layout])",
                    "docText": "When there is only single argument of integer type, " +
                      "it acts in the same way as toDateTime and returns DateTime type.\n" +
                      "When there are two arguments, first is integer or DateTime, second is constant format string, " +
                      "it acts in the same way as formatDateTime and return String type."
                }
            ];
            
            var stringFunctionsCompletions = [
                {
                    "name": "empty",
                    "def": "empty(s)",
                    "docText": "Returns 1 for an empty string or 0 for a non-empty string.\n" +
                      "The result type is UInt8.\n" +
                      "A string is considered non-empty if it contains at least one byte, even if this is a space or " +
                      "a null byte.\n" +
                      "The function also works for arrays."
                },
                {
                    "name": "notEmpty",
                    "def": "notEmpty(s)",
                    "docText": "Returns 0 for an empty string or 1 for a non-empty string.\n" +
                      "The result type is UInt8.\n" +
                      "The function also works for arrays."
                },
                {
                    "name": "length",
                    "def": "length(s)",
                    "docText": "Returns the length of a string in bytes (not in characters, and not in code " +
                      "points).\n" +
                      "The result type is UInt64.\n" +
                      "The function also works for arrays."
                },
                {
                    "name": "lengthUTF8",
                    "def": "lengthUTF8(s)",
                    "docText": "Returns the length of a string in Unicode code points (not in characters), " +
                      "assuming that the string contains a set of bytes that make up UTF-8 encoded text.\n" +
                      "If this assumption is not met, it returns some result (it doesn’t throw an exception).\n" +
                      "The result type is UInt64."
                },
                {
                    "name": "char_length",
                    "def": "char_length(s)",
                    "docText": "Returns the length of a string in Unicode code points (not in characters), " +
                      "assuming that the string contains a set of bytes that make up UTF-8 encoded text.\n" +
                      "If this assumption is not met, it returns some result (it doesn’t throw an exception).\n" +
                      "The result type is UInt64."
                },
                {
                    "name": "CHAR_LENGTH",
                    "def": "CHAR_LENGTH(s)",
                    "docText": "Returns the length of a string in Unicode code points (not in characters), " +
                      "assuming that the string contains a set of bytes that make up UTF-8 encoded text.\n" +
                      "If this assumption is not met, it returns some result (it doesn’t throw an exception).\n" +
                      "The result type is UInt64."
                },
                {
                    "name": "character_length",
                    "def": "character_length(s)",
                    "docText": "Returns the length of a string in Unicode code points (not in characters), " +
                      "assuming that the string contains a set of bytes that make up UTF-8 encoded text.\n" +
                      "If this assumption is not met, it returns some result (it doesn’t throw an exception).\n" +
                      "The result type is UInt64."
                },
                {
                    "name": "CHARACTER_LENGTH",
                    "def": "CHARACTER_LENGTH(s)",
                    "docText": "Returns the length of a string in Unicode code points (not in characters), " +
                      "assuming that the string contains a set of bytes that make up UTF-8 encoded text.\n" +
                      "If this assumption is not met, it returns some result (it doesn’t throw an exception).\n" +
                      "The result type is UInt64."
                },
                {
                    "name": "lower",
                    "def": "lower(s)",
                    "docText": "Converts ASCII Latin symbols in a string to lowercase."
                },
                {
                    "name": "lcase",
                    "def": "lcase(s)",
                    "docText": "Converts ASCII Latin symbols in a string to lowercase."
                },
                {
                    "name": "lowerUTF8",
                    "def": "lowerUTF8(s)",
                    "docText": "Converts a string to lowercase, assuming the string contains a set of bytes that " +
                      "make up a UTF-8 encoded text.\n" +
                      "It doesn’t detect the language. So for Turkish the result might not be exactly correct.\n" +
                      "If the length of the UTF-8 byte sequence is different for upper and lower case of a code " +
                      "point, the result may be incorrect for this code point.\n" +
                      "If the string contains a set of bytes that is not UTF-8, then the behavior is undefined."
                },
                {
                    "name": "upper",
                    "def": "upper(s)",
                    "docText": "Converts ASCII Latin symbols in a string to uppercase."
                },
                {
                    "name": "ucase",
                    "def": "ucase(s)",
                    "docText": "Converts ASCII Latin symbols in a string to uppercase."
                },
                {
                    "name": "upperUTF8",
                    "def": "upperUTF8(v)",
                    "docText": "Converts a string to uppercase, assuming the string contains a set of bytes that " +
                      "make up a UTF-8 encoded text.\n" +
                      "It doesn’t detect the language. So for Turkish the result might not be exactly correct.\n" +
                      "If the length of the UTF-8 byte sequence is different for upper and lower case of a code " +
                      "point, the result may be incorrect for this code point.\n" +
                      "If the string contains a set of bytes that is not UTF-8, then the behavior is undefined."
                },
                {
                    "name": "isValidUTF8",
                    "def": "isValidUTF8(s)",
                    "docText": "Returns 1, if the set of bytes is valid UTF-8 encoded, otherwise 0."
                },
                {
                    "name": "toValidUTF8",
                    "def": "toValidUTF8(s)",
                    "docText": "Replaces invalid UTF-8 characters by the (U+FFFD) character.\n" +
                      "All running in a row invalid characters are collapsed into the one replacement character."
                },
                {
                    "name": "repeat",
                    "def": "repeat(s, n)",
                    "docText": "Repeats a string as many times as specified and concatenates the replicated values " +
                      "as a single string.\n" +
                      "s — The string to repeat. String.\n" +
                      "n — The number of times to repeat the string. UInt. If n < 1, the function returns empty string."
                },
                {
                    "name": "reverse",
                    "def": "reverse(s)",
                    "docText": "Reverses the string (as a sequence of bytes).\n" +
                      "Also works with arrays."
                },
                {
                    "name": "reverseUTF8",
                    "def": "reverseUTF8(s)",
                    "docText": "Reverses a sequence of Unicode code points, assuming that the string contains a set " +
                      "of bytes representing a UTF-8 text.\n" +
                      "Otherwise, it does something else (it doesn’t throw an exception)."
                },
                {
                    "name": "format",
                    "def": "format(pattern, s0, s1, …)",
                    "docText": "Formatting constant pattern with the string listed in the arguments.\n" +
                      "pattern - a simplified Python format pattern.\n" +
                      "Format string contains “replacement fields” surrounded by curly braces {}. " +
                      "Anything that is not contained in braces is considered literal text, " +
                      "which is copied unchanged to the output. " +
                      "If you need to include a brace character in the literal text, " +
                      "it can be escaped by doubling: {{ and }}. " +
                      "Field names can be numbers (starting from zero) or empty " +
                      "(then they are treated as consequence numbers)."
                },
                {
                    "name": "concat",
                    "def": "concat(s1, s2, ...)",
                    "docText": "Concatenates the strings listed in the arguments, without a separator."
                },
                {
                    "name": "concatAssumeInjective",
                    "def": "concatAssumeInjective(s1, s2, ...)",
                    "docText": "Returns the String that results from concatenating the arguments.\n" +
                      "If any of argument values is NULL, concatAssumeInjective returns NULL."
                },
                {
                    "name": "substring",
                    "def": "substring(s, offset, length)",
                    "docText": "Returns a substring starting with the byte from the ‘offset’ index that is ‘length’ " +
                      "bytes long.\n" +
                      "Character indexing starts from one (as in standard SQL).\n" +
                      "The ‘offset’ and ‘length’ arguments must be constants."
                },
                {
                    "name": "mid",
                    "def": "mid(s, offset, length)",
                    "docText": "Returns a substring starting with the byte from the ‘offset’ index that is ‘length’ " +
                      "bytes long.\n" +
                      "Character indexing starts from one (as in standard SQL).\n" +
                      "The ‘offset’ and ‘length’ arguments must be constants."
                },
                {
                    "name": "substr",
                    "def": "substr(s, offset, length)",
                    "docText": "Returns a substring starting with the byte from the ‘offset’ index that is ‘length’ " +
                      "bytes long.\n" +
                      "Character indexing starts from one (as in standard SQL).\n" +
                      "The ‘offset’ and ‘length’ arguments must be constants."
                },
                {
                    "name": "substringUTF8",
                    "def": "substringUTF8(s, offset, length)",
                    "docText": "The same as ‘substring’, but for Unicode code points.\n" +
                      "Works under the assumption that the string contains a set of bytes representing a UTF-8 " +
                      "encoded text. If this assumption is not met, it returns some result " +
                      "(it doesn’t throw an exception)."
                },
                {
                    "name": "appendTrailingCharIfAbsent",
                    "def": "appendTrailingCharIfAbsent(s, c)",
                    "docText": "If the ‘s’ string is non-empty and does not contain the ‘c’ character at the end, " +
                      "it appends the ‘c’ character to the end."
                },
                {
                    "name": "convertCharset",
                    "def": "convertCharset(s, from, to)",
                    "docText": "Returns the string ‘s’ that was converted from the encoding in ‘from’ to the " +
                      "encoding in ‘to’."
                },
                {
                    "name": "base64Encode",
                    "def": "base64Encode(s)",
                    "docText": "Encodes ‘s’ string into base64"
                },
                {
                    "name": "base64Decode",
                    "def": "base64Decode(s)",
                    "docText": "Decode base64-encoded string ‘s’ into original string. " +
                      "In case of failure raises an exception."
                },
                {
                    "name": "tryBase64Decode",
                    "def": "tryBase64Decode(s)",
                    "docText": "Similar to base64Decode, but in case of error an empty string would be returned."
                },
                {
                    "name": "endsWith",
                    "def": "endsWith(s, suffix)",
                    "docText": "Returns whether to end with the specified suffix. " +
                      "Returns 1 if the string ends with the specified suffix, otherwise it returns 0."
                },
                {
                    "name": "startsWith",
                    "def": "startsWith(str, prefix)",
                    "docText": "Returns 1 whether string starts with the specified prefix, otherwise it returns 0."
                },
                {
                    "name": "trim",
                    "def": "trim([LEADING|TRAILING|BOTH] trim_character FROM] input_string)",
                    "docText": "Removes all specified characters from the start or end of a string.\n" +
                      "By default removes all consecutive occurrences of common whitespace (ASCII character 32) " +
                      "from both ends of a string.\n" +
                      "\n" +
                      "Parameters:\n" +
                      "trim_character — specified characters for trim. String.\n" +
                      "input_string — string for trim. String.\n" +
                      "\n" +
                      "Example:\n" +
                      "SELECT trim(BOTH ' ()' FROM '(   Hello, world!   )')"
                },
                {
                    "name": "trimLeft",
                    "def": "trimLeft(input_string)",
                    "docText": "Removes all consecutive occurrences of common whitespace (ASCII character 32) " +
                      "from the beginning of a string. It doesn’t remove other kinds of whitespace characters " +
                      "(tab, no-break space, etc.)."
                },
                {
                    "name": "trimRight",
                    "def": "trimRight(input_string)",
                    "docText": "Removes all consecutive occurrences of common whitespace (ASCII character 32) " +
                      "from the end of a string. It doesn’t remove other kinds of whitespace characters " +
                      "(tab, no-break space, etc.)."
                },
                {
                    "name": "trimBoth",
                    "def": "trimBoth(input_string)",
                    "docText": "Removes all consecutive occurrences of common whitespace (ASCII character 32) " +
                      "from both ends of a string. It doesn’t remove other kinds of whitespace characters " +
                      "(tab, no-break space, etc.)."
                },
                {
                    "name": "CRC32",
                    "def": "CRC32(s)",
                    "docText": "Returns the CRC32 checksum of a string, using CRC-32-IEEE 802.3 polynomial and " +
                      "initial value 0xffffffff (zlib implementation).\n" +
                      "The result type is UInt32."
                },
                {
                    "name": "CRC32IEEE",
                    "def": "CRC32IEEE(s)",
                    "docText": "Returns the CRC32 checksum of a string, using CRC-32-IEEE 802.3 polynomial.\n" +
                      "The result type is UInt32."
                },
                {
                    "name": "CRC64",
                    "def": "CRC64(s)",
                    "docText": "Returns the CRC64 checksum of a string, using CRC-64-ECMA polynomial.\n" +
                      "The result type is UInt64."
                }
            ];
            
            var stringsSearchingFunctionsCompletions = [
                {
                    "name": "position",
                    "def": "position(haystack, needle)",
                    "docText": "Returns the position (in bytes) of the found substring in the string, " +
                      "starting from 1.\n" +
                      "Works under the assumption that the string contains a set of bytes representing " +
                      "a single-byte encoded text. If this assumption is not met and a character can’t be " +
                      "represented using a single byte, the function doesn’t throw an exception and returns some " +
                      "unexpected result. If character can be represented using two bytes, it will use two bytes and " +
                      "so on.\n" +
                      "\n" +
                      "For a case-insensitive search, use the function positionCaseInsensitive."
                },
                {
                    "name": "locate",
                    "def": "locate(haystack, needle)",
                    "docText": "Returns the position (in bytes) of the found substring in the string, " +
                      "starting from 1. 0, if the substring was not found.\n" +
                      "Works under the assumption that the string contains a set of bytes representing " +
                      "a single-byte encoded text. If this assumption is not met and a character can’t be " +
                      "represented using a single byte, the function doesn’t throw an exception and returns some " +
                      "unexpected result. If character can be represented using two bytes, it will use two bytes and " +
                      "so on.\n" +
                      "\n" +
                      "For a case-insensitive search, use the function positionCaseInsensitive."
                },
                {
                    "name": "positionCaseInsensitive",
                    "def": "positionCaseInsensitive(haystack, needle)",
                    "docText": "The same as position returns the position (in bytes) of the found substring in the " +
                      "string, starting from 1. Use the function for a case-insensitive search."
                },
                {
                    "name": "positionUTF8",
                    "def": "positionUTF8(haystack, needle)",
                    "docText": "Returns the position (in Unicode points) of the found substring in the string, " +
                      "starting from 1.\n" +
                      "Works under the assumption that the string contains a set of bytes representing a UTF-8 " +
                      "encoded text. If this assumption is not met, the function doesn’t throw an exception and " +
                      "returns some unexpected result. If character can be represented using two Unicode points, " +
                      "it will use two and so on.\n" +
                      "For a case-insensitive search, use the function positionCaseInsensitiveUTF8."
                },
                {
                    "name": "positionCaseInsensitiveUTF8",
                    "def": "positionCaseInsensitiveUTF8(haystack, needle)",
                    "docText": "The same as positionUTF8, but is case-insensitive.\n" +
                      "Returns the position (in Unicode points) of the found substring in the string, " +
                      "starting from 1.\n" +
                      "Works under the assumption that the string contains a set of bytes representing a UTF-8 " +
                      "encoded text. If this assumption is not met, the function doesn’t throw an exception and " +
                      "returns some unexpected result. If character can be represented using two Unicode points, " +
                      "it will use two and so on."
                },
                {
                    "name": "multiSearchAllPositions",
                    "def": "multiSearchAllPositions(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "The same as position but returns Array of positions (in bytes) of the found " +
                      "corresponding substrings in the string. Positions are indexed starting from 1.\n" +
                      "The search is performed on sequences of bytes without respect to string encoding and " +
                      "collation.\n" +
                      "\n" +
                      "Returns Array of starting positions in bytes (counting from 1), if the corresponding " +
                      "substring was found and 0 if not found."
                },
                {
                    "name": "multiSearchAllPositionsCaseInsensitive",
                    "def": "multiSearchAllPositionsCaseInsensitive(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "For case-insensitive ASCII search"
                },
                {
                    "name": "multiSearchAllPositionsUTF8",
                    "def": "multiSearchAllPositionsUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "For search in UTF-8"
                },
                {
                    "name": "multiSearchAllPositionsCaseInsensitiveUTF8",
                    "def": "multiSearchAllPositionsCaseInsensitiveUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "For case-insensitive UTF-8 search"
                },
                {
                    "name": "multiSearchFirstPosition",
                    "def": "multiSearchFirstPosition(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "The same as position but returns the leftmost offset of the string haystack that is " +
                      "matched to some of the needles."
                },
                {
                    "name": "multiSearchFirstPositionCaseInsensitive",
                    "def": "multiSearchFirstPositionCaseInsensitive(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchFirstPositionUTF8",
                    "def": "multiSearchFirstPositionUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchFirstPositionCaseInsensitiveUTF8",
                    "def": "multiSearchFirstPositionCaseInsensitiveUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchFirstIndex",
                    "def": "multiSearchFirstIndex(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "Returns the index i (starting from 1) of the leftmost found needle(i) in the string " +
                      "haystack and 0 otherwise."
                },
                {
                    "name": "multiSearchFirstIndexCaseInsensitive",
                    "def": "multiSearchFirstIndexCaseInsensitive(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchFirstIndexUTF8",
                    "def": "multiSearchFirstIndexUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchFirstIndexCaseInsensitiveUTF8",
                    "def": "multiSearchFirstIndexCaseInsensitiveUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchAny",
                    "def": "multiSearchAny(haystack[, needle1, needle2, ..., needlen])",
                    "docText": "Returns 1, if at least one string needlei matches the string haystack and 0 otherwise."
                },
                {
                    "name": "multiSearchAnyCaseInsensitive",
                    "def": "multiSearchAnyCaseInsensitive(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchAnyUTF8",
                    "def": "multiSearchAnyUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "multiSearchAnyCaseInsensitiveUTF8",
                    "def": "multiSearchAnyCaseInsensitiveUTF8(haystack[, needle1, needle2, ..., needlen])",
                    "docText": ""
                },
                {
                    "name": "match",
                    "def": "match(haystack, pattern)",
                    "docText": "Checks whether the string matches the pattern regular expression. A re2 regular " +
                      "expression. The syntax of the re2 regular expressions is more limited than the syntax " +
                      "of the Perl regular expressions.\n" +
                      "Returns 0 if it doesn’t match, or 1 if it matches.\n" +
                      "Note that the backslash symbol (\) is used for escaping in the regular expression. " +
                      "The same symbol is used for escaping in string literals. So in order to escape the symbol " +
                      "in a regular expression, you must write two backslashes (\) in a string literal.\n" +
                      "The regular expression works with the string as if it is a set of bytes. The regular " +
                      "expression can’t contain null bytes.\n" +
                      "For patterns to search for substrings in a string, it is better to use LIKE or ‘position’, " +
                      "since they work much faster."
                },
                {
                    "name": "multiMatchAny",
                    "def": "multiMatchAny(haystack[, pattern1, pattern2, …, patternn])",
                    "docText": "The same as match, but returns 0 if none of the regular expressions are matched and " +
                      "1 if any of the patterns matches. It uses hyperscan library. For patterns to search " +
                      "substrings in a string, it is better to use multiSearchAny since it works much faster"
                },
                {
                    "name": "multiMatchAnyIndex",
                    "def": "multiMatchAnyIndex(haystack[, pattern1, pattern2, …, patternn])",
                    "docText": "The same as multiMatchAny, but returns any index that matches the haystack."
                },
                {
                    "name": "multiMatchAllIndices",
                    "def": "multiMatchAllIndices(haystack[, pattern1, pattern2, …, patternn])",
                    "docText": "The same as multiMatchAny, but returns the array of all indices that match the " +
                      "haystack in any order."
                },
                {
                    "name": "multiFuzzyMatchAny",
                    "def": "multiFuzzyMatchAny(haystack, distance[, pattern1, pattern2, …, patternn])",
                    "docText": "The same as multiMatchAny, but returns 1 if any pattern matches the haystack " +
                      "within a constant edit distance.\n" +
                      "This function is also in an experimental mode and can be extremely slow."
                },
                {
                    "name": "multiFuzzyMatchAnyIndex",
                    "def": "multiFuzzyMatchAnyIndex(haystack, distance[, pattern1, pattern2, …, patternn])",
                    "docText": "The same as multiFuzzyMatchAny, but returns any index that matches the haystack " +
                      "within a constant edit distance."
                },
                {
                    "name": "multiFuzzyMatchAllIndices",
                    "def": "multiFuzzyMatchAllIndices(haystack, distance[, pattern1, pattern2, …, patternn])",
                    "docText": "The same as multiFuzzyMatchAny, but returns any index that matches the haystack " +
                      "within a constant edit distance."
                },
                {
                    "name": "extract",
                    "def": "extract(haystack, pattern)",
                    "docText": "Extracts a fragment of a string using a regular expression.\n" +
                      "If ‘haystack’ doesn’t match the ‘pattern’ regex, an empty string is returned.\n" +
                      "If the regex doesn’t contain subpatterns, it takes the fragment that matches the " +
                      "entire regex.\n" +
                      "Otherwise, it takes the fragment that matches the first subpattern."
                },
                {
                    "name": "extractAll",
                    "def": "extractAll(haystack, pattern)",
                    "docText": "Extracts all the fragments of a string using a regular expression.\n" +
                      "If ‘haystack’ doesn’t match the ‘pattern’ regex, an empty string is returned.\n" +
                      "Returns an array of strings consisting of all matches to the regex.\n" +
                      "In general, the behavior is the same as the ‘extract’ function (it takes the first " +
                      "subpattern, or the entire expression if there isn’t a subpattern)."
                },
                {
                    "name": "like",
                    "def": "like(haystack, pattern)",
                    "docText": "haystack LIKE pattern operator\n" +
                      "Checks whether a string matches a simple regular expression.\n" +
                      "The regular expression can contain the metasymbols % and _.\n" +
                      "\n" +
                      "% indicates any quantity of any bytes (including zero characters).\n" +
                      "_ indicates any one byte.\n" +
                      "\n" +
                      "Use the backslash (\\) for escaping metasymbols. See the note on escaping in the description " +
                      "of the ‘match’ function.\n" +
                      "For regular expressions like %needle%, the code is more optimal and works as fast as the " +
                      "position function.\n" +
                      "For other regular expressions, the code is the same as for the ‘match’ function."
                },
                {
                    "name": "notLike",
                    "def": "notLike(haystack, pattern)",
                    "docText": "haystack NOT LIKE pattern operator\n" +
                      "The same thing as ‘like’, but negative."
                },
                {
                    "name": "ngramDistance",
                    "def": "ngramDistance(haystack, needle)",
                    "docText": "Calculates the 4-gram distance between haystack and needle: " +
                      "counts the symmetric difference between two multisets of 4-grams and normalizes it by " +
                      "the sum of their cardinalities.\n" +
                      "Returns float number from 0 to 1 – the closer to zero, " +
                      "the more strings are similar to each other.\n" +
                      "If the constant needle or haystack is more than 32Kb, throws an exception.\n" +
                      "If some of the non-constant haystack or needle strings are more than 32Kb, " +
                      "the distance is always one."
                },
                {
                    "name": "ngramDistanceCaseInsensitive",
                    "def": "ngramDistanceCaseInsensitive(haystack, needle)",
                    "docText": ""
                },
                {
                    "name": "ngramDistanceUTF8",
                    "def": "ngramDistanceUTF8(haystack, needle)",
                    "docText": ""
                },
                {
                    "name": "ngramDistanceCaseInsensitiveUTF8",
                    "def": "ngramDistanceCaseInsensitiveUTF8(haystack, needle)",
                    "docText": ""
                },
                {
                    "name": "ngramSearch",
                    "def": "ngramSearch(haystack, needle)",
                    "docText": "Same as ngramDistance but calculates the non-symmetric difference between " +
                      "needle and haystack – the number of n-grams from needle minus the common number of n" +
                      "-grams normalized by the number of needle n-grams.\n" +
                      "The closer to one, the more likely needle is in the haystack. Can be useful for fuzzy " +
                      "string search."
                },
                {
                    "name": "ngramSearchCaseInsensitive",
                    "def": "ngramSearchCaseInsensitive(haystack, needle)",
                    "docText": ""
                },
                {
                    "name": "ngramSearchUTF8",
                    "def": "ngramSearchUTF8(haystack, needle)",
                    "docText": ""
                },
                {
                    "name": "ngramSearchCaseInsensitiveUTF8",
                    "def": "ngramSearchCaseInsensitiveUTF8(haystack, needle)",
                    "docText": ""
                }
            ];
            
            var stringsReplacingFunctionsCompletions = [
                {
                    "name": "replaceOne",
                    "def": "replaceOne(haystack, pattern, replacement)",
                    "docText": "Replaces the first occurrence, if it exists, of the ‘pattern’ substring in " +
                      "‘haystack’ with the ‘replacement’ substring.\n" +
                      "Hereafter, ‘pattern’ and ‘replacement’ must be constants."
                },
                {
                    "name": "replaceAll",
                    "def": "replaceAll(haystack, pattern, replacement)",
                    "docText": "Replaces all occurrences of the ‘pattern’ substring in ‘haystack’ with the " +
                      "‘replacement’ substring."
                },
                {
                    "name": "replace",
                    "def": "replace(haystack, pattern, replacement)",
                    "docText": "Replaces all occurrences of the ‘pattern’ substring in ‘haystack’ with the " +
                      "‘replacement’ substring."
                },
                {
                    "name": "replaceRegexpOne",
                    "def": "replaceRegexpOne(haystack, pattern, replacement)",
                    "docText": "Replacement using the ‘pattern’ regular expression. A re2 regular expression.\n" +
                      "Replaces only the first occurrence, if it exists.\n" +
                      "A pattern can be specified as ‘replacement’. This pattern can include substitutions \\0-\\9.\n" +
                      "The substitution \\0 includes the entire regular expression. Substitutions \\1-\\9 correspond " +
                      "to the subpattern numbers.To use the \\ character in a template, escape it using \\.\n" +
                      "Also keep in mind that a string literal requires an extra escape."
                },
                {
                    "name": "replaceRegexpAll",
                    "def": "replaceRegexpAll(haystack, pattern, replacement)",
                    "docText": "Replacement using the ‘pattern’ regular expression, " +
                      "but replaces all the occurrences.\n" +
                      "As an exception, if a regular expression worked on an empty substring, " +
                      "the replacement is not made more than once."
                },
                {
                    "name": "regexpQuoteMeta",
                    "def": "regexpQuoteMeta(s)",
                    "docText": "The function adds a backslash before some predefined characters in the string.\n" +
                      "Predefined characters: ‘0’, ‘\\’, ‘|’, ‘(’, ‘)’, ‘^’, ‘$’, ‘.’, ‘[’, ’]’, ‘?’, ’*‘,’+‘," +
                      "’{‘,’:‘,’-’.\n" +
                      "It escapes zero byte as \\0 instead of 00 and it escapes only required characters."
                }
            ];
            
            var conditionalFunctionsCompletions = [
                {
                    "name": "if",
                    "def": "if(cond, then, else)",
                    "docText": "cond – The condition for evaluation that can be zero or not. " +
                      "The type is UInt8, Nullable(UInt8) or NULL.\n" +
                      "then - The expression to return if condition is met.\n" +
                      "else - The expression to return if condition is not met."
                },
                {
                    "name": "?",
                    "def": "cond ? then : else",
                    "docText": "cond – The condition for evaluation that can be zero or not. " +
                      "The type is UInt8, Nullable(UInt8) or NULL.\n" +
                      "then - The expression to return if condition is met.\n" +
                      "else - The expression to return if condition is not met."
                },
                {
                    "name": "multiIf",
                    "def": "multiIf(cond_1, then_1, cond_2, then_2, ..., else)",
                    "docText": "cond_N — The condition for the function to return then_N.\n" +
                      "then_N — The result of the function when executed.\n" +
                      "else — The result of the function if none of the conditions is met."
                },
            ];
            
            var mathFunctionsCompletions = [
                {
                    "name": "e",
                    "def": "e()",
                    "docText": "Returns a Float64 number that is close to the number e."
                },
                {
                    "name": "pi",
                    "def": "pi()",
                    "docText": "Returns a Float64 number that is close to the number π."
                },
                {
                    "name": "exp",
                    "def": "exp(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the exponent " +
                      "of the argument."
                },
                {
                    "name": "log",
                    "def": "log(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the natural " +
                      "logarithm of the argument."
                },
                {
                    "name": "ln",
                    "def": "ln(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the natural " +
                      "logarithm of the argument."
                },
                {
                    "name": "exp2",
                    "def": "exp2(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to 2 to the power of x."
                },
                {
                    "name": "log2",
                    "def": "log2(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the binary " +
                      "logarithm of the argument."
                },
                {
                    "name": "exp10",
                    "def": "exp10(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to 10 to the power of x."
                },
                {
                    "name": "log10",
                    "def": "log10(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the decimal " +
                      "logarithm of the argument."
                },
                {
                    "name": "sqrt",
                    "def": "sqrt(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the square root " +
                      "of the argument."
                },
                {
                    "name": "cbrt",
                    "def": "cbrt(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to the cubic root " +
                      "of the argument."
                },
                {
                    "name": "erf",
                    "def": "erf(x)",
                    "docText": "If ‘x’ is non-negative, then erf(x / σ√2) is the probability that a random variable " +
                      "having a normal distribution with standard deviation ‘σ’ takes the value that is separated " +
                      "from the expected value by more than ‘x’."
                },
                {
                    "name": "erfc",
                    "def": "erfc(x)",
                    "docText": "Accepts a numeric argument and returns a Float64 number close to 1 - erf(x), " +
                      "but without loss of precision for large ‘x’ values."
                },
                {
                    "name": "lgamma",
                    "def": "lgamma(x)",
                    "docText": "The logarithm of the gamma function."
                },
                {
                    "name": "tgamma",
                    "def": "tgamma(x)",
                    "docText": "Gamma function."
                },
                {
                    "name": "sin",
                    "def": "sin(x)",
                    "docText": "The sine."
                },
                {
                    "name": "cos",
                    "def": "cos(x)",
                    "docText": "The cosine."
                },
                {
                    "name": "tan",
                    "def": "tan(x)",
                    "docText": "The tangent."
                },
                {
                    "name": "asin",
                    "def": "asin(x)",
                    "docText": "The arc sine."
                },
                {
                    "name": "acos",
                    "def": "acos(x)",
                    "docText": "The arc cosine."
                },
                {
                    "name": "atan",
                    "def": "atan(x)",
                    "docText": "The arc tangent."
                },
                {
                    "name": "pow",
                    "def": "pow(x, y)",
                    "docText": "Takes two numeric arguments x and y. Returns a Float64 number close to x to the " +
                      "power of y."
                },
                {
                    "name": "power",
                    "def": "power(x, y)",
                    "docText": "Takes two numeric arguments x and y. Returns a Float64 number close to x to the " +
                      "power of y."
                },
                {
                    "name": "intExp2",
                    "def": "intExp2(x)",
                    "docText": "Accepts a numeric argument and returns a UInt64 number close to 2 to the power of x."
                },
                {
                    "name": "intExp10",
                    "def": "intExp10(x)",
                    "docText": "Accepts a numeric argument and returns a UInt64 number close to 10 to the power of x."
                }
            ];
            
            var roundingFunctionsCompletions = [
                {
                    "name": "floor",
                    "def": "floor(x[, N])",
                    "docText": "Returns the largest round number that is less than or equal to x. " +
                      "A round number is a multiple of 1/10N, or the nearest number of the appropriate data type " +
                      "if 1 / 10N isn’t exact.\n" +
                      "‘N’ is an integer constant, optional parameter. " +
                      "By default it is zero, which means to round to an integer.\n" +
                      "‘N’ may be negative.\n" +
                      "\n" +
                      "x is any numeric type. The result is a number of the same type."
                },
                {
                    "name": "ceil",
                    "def": "ceil(x[, N])",
                    "docText": "Returns the smallest round number that is greater than or equal to x."
                },
                {
                    "name": "ceiling",
                    "def": "ceiling(x[, N])",
                    "docText": "Returns the smallest round number that is greater than or equal to x."
                },
                {
                    "name": "trunc",
                    "def": "trunc(x[, N])",
                    "docText": "Returns the round number with largest absolute value that has an absolute value " +
                      "less than or equal to x‘s. "
                },
                {
                    "name": "truncate",
                    "def": "truncate(x[, N])",
                    "docText": "Returns the round number with largest absolute value that has an absolute value " +
                      "less than or equal to x‘s. "
                },
                {
                    "name": "round",
                    "def": "round(expression [, decimal_places])",
                    "docText": "Rounds a value to a specified number of decimal places.\n" +
                      "expression — A number to be rounded. Can be any expression returning the numeric data type.\n" +
                      "decimal-places — An integer value.\n" +
                      "\tIf decimal-places > 0 then the function rounds the value to the right " +
                      "of the decimal point.\n" +
                      "\tIf decimal-places < 0 then the function rounds the value to the left of the decimal point.\n" +
                      "\tIf decimal-places = 0 then the function rounds the value to integer. " +
                      "In this case the argument can be omitted."
                },
                {
                    "name": "roundBankers",
                    "def": "roundBankers(expression [, decimal_places])",
                    "docText": "Banker's rounding is a method of rounding fractional numbers.\n" +
                      "When the rounding number is halfway between two numbers, it's rounded to the nearest " +
                      "even digit at the specified decimal position.\n" +
                      "expression — A number to be rounded. Can be any expression returning the numeric data type.\n" +
                      "decimal-places — Decimal places. An integer number.\n" +
                      "\tdecimal-places > 0 — The function rounds the number to the given position " +
                      "right of the decimal point. Example: roundBankers(3.55, 1) = 3.6.\n" +
                      "\tdecimal-places < 0 — The function rounds the number to the given position " +
                      "left of the decimal point. Example: roundBankers(24.55, -1) = 20.\n" +
                      "\tdecimal-places = 0 — The function rounds the number to an integer. " +
                      "In this case the argument can be omitted. Example: roundBankers(2.5) = 2."
                },
                {
                    "name": "roundToExp2",
                    "def": "roundToExp2(num)",
                    "docText": "Accepts a number. If the number is less than one, it returns 0.\n" +
                      "Otherwise, it rounds the number down to the nearest (whole non-negative) degree of two."
                },
                {
                    "name": "roundDuration",
                    "def": "roundDuration(num)",
                    "docText": "Accepts a number. If the number is less than one, it returns 0.\n" +
                      "Otherwise, it rounds the number down to numbers from the set: " +
                      "1, 10, 30, 60, 120, 180, 240, 300, 600, 1200, 1800, 3600, 7200, 18000, 36000.\n" +
                      "This function is specific to Yandex.Metrica and used for implementing the report " +
                      "on session length."
                },
                {
                    "name": "roundAge",
                    "def": "roundAge(num)",
                    "docText": "Accepts a number. If the number is less than 18, it returns 0.\n" +
                      "Otherwise, it rounds the number down to a number from the set: 18, 25, 35, 45, 55.\n" +
                      "This function is specific to Yandex.Metrica and used for implementing the report on user age."
                },
                {
                    "name": "roundDown",
                    "def": "roundDown(num)",
                    "docText": "Accepts a number and rounds it down to an element in the specified array.\n" +
                      "If the value is less than the lowest bound, the lowest bound is returned."
                }
            ];
            
            var arraysFunctionsCompletions = [
                {
                    "name": "emptyArrayUInt8",
                    "def": "emptyArrayUInt8()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayUInt16",
                    "def": "emptyArrayUInt16()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayUInt32",
                    "def": "emptyArrayUInt32()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayUInt64",
                    "def": "emptyArrayUInt64()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayInt8",
                    "def": "emptyArrayInt8()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayInt16",
                    "def": "emptyArrayInt16()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayInt32",
                    "def": "emptyArrayInt32()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayInt64",
                    "def": "emptyArrayInt64()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayFloat32",
                    "def": "emptyArrayFloat32()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayFloat64",
                    "def": "emptyArrayFloat64()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayDate",
                    "def": "emptyArrayDate()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayDateTime",
                    "def": "emptyArrayDateTime()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayString",
                    "def": "emptyArrayString()",
                    "docText": "Accepts zero arguments and returns an empty array of the appropriate type."
                },
                {
                    "name": "emptyArrayToSingle",
                    "def": "emptyArrayToSingle(arr)",
                    "docText": "Accepts an empty array and returns a one-element array that is equal to the " +
                      "default value."
                },
                {
                    "name": "range",
                    "def": "range(end), range(start, end [, step])",
                    "docText": "Returns an array of numbers from start to end-1 by step.\n" +
                      "If the argument start is not specified, defaults to 0.\n" +
                      "If the argument step is not specified, defaults to 1.\n" +
                      "It behaviors almost like pythonic range. But the difference is that all the arguments " +
                      "type must be UInt numbers.\n" +
                      "Just in case, an exception is thrown if arrays with a total length of more than 100,000,000 " +
                      "elements are created in a data block."
                },
                {
                    "name": "array",
                    "def": "array(x1, …), operator [x1, …]",
                    "docText": "Creates an array from the function arguments.\n" +
                      "The arguments must be constants and have types that have the smallest common type. " +
                      "At least one argument must be passed, because otherwise it isn’t clear which type of " +
                      "array to create. That is, you can’t use this function to create an empty array " +
                      "(to do that, use the ‘emptyArray*’ function described above).\n" +
                      "Returns an ‘Array(T)’ type result, where ‘T’ is the smallest common type out of the passed " +
                      "arguments."
                },
                {
                    "name": "arrayConcat",
                    "def": "arrayConcat(arr1, arr2, …)",
                    "docText": "Combines arrays passed as arguments."
                },
                {
                    "name": "arrayElement",
                    "def": "arrayElement(arr, n), operator arr[n]",
                    "docText": "Get the element with the index n from the array arr. n must be any integer type.\n" +
                      "Indexes in an array begin from one.\n" +
                      "Negative indexes are supported. In this case, it selects the corresponding element numbered " +
                      "from the end. For example, arr[-1] is the last item in the array.\n" +
                      "\n" +
                      "If the index falls outside of the bounds of an array, it returns some default value " +
                      "(0 for numbers, an empty string for strings, etc.), except for the case with a non-constant " +
                      "array and a constant index 0 (in this case there will be an error Array indices are 1-based)."
                },
                {
                    "name": "hasAll",
                    "def": "has(set, subset)",
                    "docText": "Checks whether one array is a subset of another.\n" +
                      "Parameters:\n" +
                      "\tset – Array of any type with a set of elements.\n" +
                      "\tsubset – Array of any type with elements that should be tested to be a subset of set.\n" +
                      "Return values:\n" +
                      "\t1, if set contains all of the elements from subset.\n" +
                      "\t0, otherwise.\n" +
                      "Peculiar properties:\n" +
                      "\tAn empty array is a subset of any array.\n" +
                      "\tNull processed as a value.\n" +
                      "\tOrder of values in both of arrays doesn’t matter."
                },
                {
                    "name": "has",
                    "def": "has(arr, elem)",
                    "docText": "Checks whether the ‘arr’ array has the ‘elem’ element.\n" +
                      "Returns 0 if the the element is not in the array, or 1 if it is.\n" +
                      "NULL is processed as a value."
                },
                {
                    "name": "hasAny",
                    "def": "hasAny(array1, array2)",
                    "docText": "Checks whether two arrays have intersection by some elements.\n" +
                      "Return values:\n" +
                      "\t1, if array1 and array2 have one similar element at least.\n" +
                      "\t0, otherwise.\n" +
                      "Peculiar properties:\n" +
                      "\tNull processed as a value.\n" +
                      "\tOrder of values in both of arrays doesn’t matter."
                },
                {
                    "name": "hasSubstr",
                    "def": "hasSubstr(array1, array2)",
                    "docText": "Checks whether all the elements of array2 appear in array1 in the same exact order. " +
                      "Therefore, the function will return 1, if and only if array1 = prefix + array2 + suffix." +
                      "Return values:\n" +
                      "\t1, if array1 contains array2.\n" +
                      "\t0, otherwise.\n" +
                      "Peculiar properties:\n" +
                      "\tThe function will return 1 if array2 is empty.\n" +
                      "\tNull processed as a value. In other words hasSubstr([1, 2, NULL, 3, 4], [2,3]) " +
                      "will return 0. However, hasSubstr([1, 2, NULL, 3, 4], [2,NULL,3]) will return 1\n" +
                      "\tOrder of values in both of arrays does matter."
                },
                {
                    "name": "indexOf",
                    "def": "indexOf(arr, x)",
                    "docText": "Returns the index of the first ‘x’ element (starting from 1) if it is in the array, " +
                      "or 0 if it is not.\n" +
                      "Elements set to NULL are handled as normal values."
                },
                {
                    "name": "countEqual",
                    "def": "countEqual(arr, x)",
                    "docText": "Returns the number of elements in the array equal to x. " +
                      "Equivalent to arrayCount (elem -> elem = x, arr).\n" +
                      "NULL elements are handled as separate values."
                },
                {
                    "name": "arrayEnumerate",
                    "def": "arrayEnumerate(arr)",
                    "docText": "Returns the array [1, 2, 3, …, length (arr) ]"
                },
                {
                    "name": "arrayEnumerateUniq",
                    "def": "arrayEnumerateUniq(arr, …)",
                    "docText": "Returns an array the same size as the source array, " +
                      "indicating for each element what its position is among elements with the same value.\n" +
                      "For example: arrayEnumerateUniq([10, 20, 10, 30]) = [1, 1, 2, 1]."
                },
                {
                    "name": "arrayPopBack",
                    "def": "arrayPopBack(arr)",
                    "docText": "Removes the last item from the array."
                },
                {
                    "name": "arrayPopFront",
                    "def": "arrayPopFront(arr)",
                    "docText": "Removes the first item from the array."
                },
                {
                    "name": "arrayPushBack",
                    "def": "arrayPushBack(array, single_value)",
                    "docText": "Adds one item to the end of the array.\n" +
                      "array – Array.\n" +
                      "single_value – A single value.\n" +
                      "Only numbers can be added to an array with numbers, and only strings can be added to an " +
                      "array of strings. When adding numbers, ClickHouse automatically sets the single_value type " +
                      "for the data type of the array.\n" +
                      "Can be NULL. The function adds a NULL element to an array, and the type of array " +
                      "elements converts to Nullable."
                },
                {
                    "name": "arrayPushFront",
                    "def": "arrayPushBack(array, single_value)",
                    "docText": "Adds one item to the beginning of the array.\n" +
                      "array – Array.\n" +
                      "single_value – A single value.\n" +
                      "Only numbers can be added to an array with numbers, and only strings can be added to an " +
                      "array of strings. When adding numbers, ClickHouse automatically sets the single_value type " +
                      "for the data type of the array.\n" +
                      "Can be NULL. The function adds a NULL element to an array, and the type of array " +
                      "elements converts to Nullable."
                },
                {
                    "name": "arrayResize",
                    "def": "arrayResize(array, size[, extender])",
                    "docText": "Changes the length of the array.\n" +
                      "array — Array.\n" +
                      "size — Required length of the array.\n" +
                      "\tIf size is less than the original size of the array, " +
                      "the array is truncated from the right.\n" +
                      "\tIf size is larger than the initial size of the array, " +
                      "the array is extended to the right with extender values or " +
                      "default values for the data type of the array items.\n" +
                      "extender — Value for extending an array. Can be NULL."
                },
                {
                    "name": "arraySlice",
                    "def": "arraySlice(array, offset[, length])",
                    "docText": "Returns a slice of the array.\n" +
                      "array – Array of data.\n" +
                      "offset – Indent from the edge of the array. A positive value indicates an offset on the left, " +
                      "and a negative value is an indent on the right. Numbering of the array items begins with 1.\n" +
                      "length - The length of the required slice. If you specify a negative value, the function " +
                      "returns an open slice [offset, array_length - length). If you omit the value, the function " +
                      "returns the slice [offset, the_end_of_array]."
                },
                {
                    "name": "arraySort",
                    "def": "arraySort([func,] arr, …)",
                    "docText": "Sorts the elements of the arr array in ascending order.\n" +
                      "If the function is specified, sorting order is determined by the result of the function " +
                      "applied to the elements of the array.\n" +
                      "If func accepts multiple arguments, the arraySort function is passed several arrays that the " +
                      "arguments of func will correspond to."
                },
                {
                    "name": "arrayReverseSort",
                    "def": "arrayReverseSort([func,] arr, …)",
                    "docText": "Sorts the elements of the arr array in descending order.\n" +
                      "If the func function is specified, arr is sorted according to the result of the func function " +
                      "applied to the elements of the array, and then the sorted array is reversed.\n" +
                      "If func accepts multiple arguments, the arrayReverseSort function is passed several arrays " +
                      "that the arguments of func will correspond to."
                },
                {
                    "name": "arrayUniq",
                    "def": "arrayUniq(arr, …)",
                    "docText": "If one argument is passed, it counts the number of different elements in the array.\n" +
                      "If multiple arguments are passed, it counts the number of different tuples of elements at " +
                      "corresponding positions in multiple arrays.\n" +
                      "If you want to get a list of unique items in an array, you can use " +
                      "arrayReduce(‘groupUniqArray’, arr)."
                },
                {
                    "name": "arrayJoin",
                    "def": "arrayJoin(arr)",
                    "docText": "This is a very unusual function.\n" +
                      "Normal functions don’t change a set of rows, but just change the values in each row (map).\n" +
                      "Aggregate functions compress a set of rows (fold or reduce).\n" +
                      "The ‘arrayJoin’ function takes each row and generates a set of rows (unfold).\n" +
                      "This function takes an array as an argument, and propagates the source row to multiple rows " +
                      "for the number of elements in the array.\n" +
                      "All the values in columns are simply copied, except the values in the column where this " +
                      "function is applied; it is replaced with the corresponding array value.\n" +
                      "A query can use multiple arrayJoin functions. In this case, the transformation is performed " +
                      "multiple times.\n" +
                      "Note the ARRAY JOIN syntax in the SELECT query, which provides broader possibilities."
                },
                {
                    "name": "arrayDifference",
                    "def": "arrayDifference(arr)",
                    "docText": "Calculates the difference between adjacent array elements.\n" +
                      "Returns an array where the first element will be 0, the second is the difference " +
                      "between a[1] - a[0], etc.\n" +
                      "The type of elements in the resulting array is determined by the type inference rules for " +
                      "subtraction (e.g. UInt8 - UInt8 = Int16)"
                },
                {
                    "name": "arrayDistinct",
                    "def": "arrayDistinct(arr)",
                    "docText": "Takes an array, returns an array containing the distinct elements only."
                },
                {
                    "name": "arrayEnumerateDense",
                    "def": "arrayEnumerateDense(arr)",
                    "docText": "Returns an array of the same size as the source array, indicating where each element " +
                      "first appears in the source array."
                },
                {
                    "name": "arrayIntersect",
                    "def": "arrayIntersect(arr1, arr2, ..., arrN)",
                    "docText": "Takes multiple arrays, returns an array with elements that are present in all " +
                      "source arrays.\n" +
                      "Elements order in the resulting array is the same as in the first array."
                },
                {
                    "name": "arrayReduce",
                    "def": "arrayReduce(agg_func, arr1, arr2, ..., arrN)",
                    "docText": "Applies an aggregate function to array elements and returns its result.\n" +
                      "The name of the aggregation function is passed as a string in single quotes 'max', 'sum'.\n" +
                      "When using parametric aggregate functions, the parameter is indicated after the function name " +
                      "in parentheses 'uniqUpTo(6)'.\n" +
                      "\n" +
                      "agg_func — The name of an aggregate function which should be a constant string.\n" +
                      "arr — Any number of array type columns as the parameters of the aggregation function."
                },
                {
                    "name": "arrayReduceInRanges",
                    "def": "arrayReduceInRanges(agg_func, arr1, arr2, ..., arrN)",
                    "docText": "Applies an aggregate function to array elements in given ranges and returns an array " +
                      "containing the result corresponding to each range.\n" +
                      "The function will return the same result as multiple " +
                      "arrayReduce(agg_func, arraySlice(arr1, index, length), ...).\n" +
                      "agg_func — The name of an aggregate function which should be a constant string.\n" +
                      "ranges — The ranges to aggretate which should be an array of tuples which containing the " +
                      "index and the length of each range.\n" +
                      "arr — Any number of Array type columns as the parameters of the aggregation function."
                },
                {
                    "name": "arrayReverse",
                    "def": "arrayReverse(arr)",
                    "docText": "Returns an array of the same size as the original array containing the elements " +
                      "in reverse order."
                },
                {
                    "name": "arrayFlatten",
                    "def": "arrayFlatten(array_of_arrays)",
                    "docText": "Converts an array of arrays to a flat array."
                },
                {
                    "name": "arrayCompact",
                    "def": "arrayCompact(arr)",
                    "docText": "Removes consecutive duplicate elements from an array.\n" +
                      "The order of result values is determined by the order in the source array."
                },
                {
                    "name": "arrayZip",
                    "def": "arrayZip(arr1, arr2, ..., arrN)",
                    "docText": "Combines multiple arrays into a single array.\n" +
                      "The resulting array contains the corresponding elements of the source arrays grouped into " +
                      "tuples in the listed order of arguments."
                },
                {
                    "name": "arrayAUC",
                    "def": "arrayAUC(arr_scores, arr_labels)",
                    "docText": "Calculate AUC (Area Under the Curve - a concept in machine learning area).\n" +
                      "Parameters:\n" +
                      "\tarr_scores — scores prediction model gives.\n" +
                      "\tarr_labels — labels of samples, usually 1 for positive sample and 0 for negtive sample.\n" +
                      "Returned value:\n" +
                      "\tReturns AUC value with type Float64."
                }
            ];
            
            var mapsFunctionsCompletions = [
                {
                    "name": "mapAdd",
                    "def": "mapAdd(Tuple(Array, Array, Tuple(Array, Array)[, ...])",
                    "docText": "Collects all the keys and sum corresponding values.\n" +
                      "\n" +
                      "Arguments are tuples of two arrays, where items in the first array represent keys, " +
                      "and the second array\n" +
                      "contains values for the each key.\n" +
                      "All key arrays should have same type, and all value arrays should contain items which are " +
                      "promotable to the one type (Int64, UInt64 or Float64).\n" +
                      "The common promoted type is used as a type for the result array.\n" +
                      "\n" +
                      "Returns one tuple, where the first array contains the sorted keys and the second array " +
                      "contains values."
                },
                {
                    "name": "mapSubtract",
                    "def": "mapSubtract(Tuple(Array, Array, Tuple(Array, Array)[, ...])",
                    "docText": "Collects all the keys and subtract corresponding values.\n" +
                      "\n" +
                      "Arguments are tuples of two arrays, where items in the first array represent keys, and the " +
                      "second array contains values for the each key.\n" +
                      "All key arrays should have same type, and all value arrays should contain items which are " +
                      "promotable to the one type (Int64, UInt64 or Float64).\n" +
                      "The common promoted type is used as a type for the result array.\n" +
                      "\n" +
                      "Returns one tuple, where the first array contains the sorted keys and the second array " +
                      "contains values."
                },
            ];
            
            var splittingMergingFunctionsCompletions = [
                {
                    "name": "splitByChar",
                    "def": "splitByChar(separator, s)",
                    "docText": "Splits a string into substrings separated by a string.\n" +
                      "It uses a constant string separator of multiple characters as the separator.\n" +
                      "If the string separator is empty, it will split the string s into an array " +
                      "of single characters.\n" +
                      "\tseparator — The separator which should contain exactly one character. String.\n" +
                      "\ts — The string to split. String."
                },
                {
                    "name": "splitByString",
                    "def": "splitByString(separator, s)",
                    "docText": "Splits a string into substrings separated by a specified character. " +
                      "It uses a constant string separator which consisting of exactly one character.\n" +
                      "Returns an array of selected substrings. Empty substrings may be selected if the separator " +
                      "occurs at the beginning or end of the string, or if there are multiple consecutive separators."
                },
                {
                    "name": "arrayStringConcat",
                    "def": "arrayStringConcat(arr[, separator])",
                    "docText": "Concatenates the strings listed in the array with the separator.\n" +
                      "’separator’ is an optional parameter: a constant string, set to an empty string by default.\n" +
                      "Returns the string."
                },
                {
                    "name": "alphaTokens",
                    "def": "alphaTokens(s)",
                    "docText": "Selects substrings of consecutive bytes from the ranges a-z and A-Z.\n" +
                      "Returns an array of substrings."
                },
                {
                    "name": "extractAllGroups",
                    "def": "extractAllGroups(text, regexp)",
                    "docText": "Extracts all groups from non-overlapping substrings matched by a " +
                      "regular expression.\n" +
                      "Parameters:\n" +
                      "\ttext — String or FixedString.\n" +
                      "\tregexp — Regular expression. Constant. String or FixedString.\n" +
                      "Returned values:\n" +
                      "\tIf the function finds at least one matching group, it returns Array(Array(String)) column, " +
                      "clustered by group_id (1 to N, where N is number of capturing groups in regexp).\n" +
                      "\tIf there is no matching group, returns an empty array."
                }
            ];
            
            var bitFunctionsCompletions = [
                {
                    "name": "bitAnd",
                    "def": "bitAnd(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitOr",
                    "def": "bitOr(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitXor",
                    "def": "bitXor(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitNot",
                    "def": "bitNot(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitShiftLeft",
                    "def": "bitShiftLeft(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitShiftRight",
                    "def": "bitShiftRight(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitRotateLeft",
                    "def": "bitRotateLeft(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitRotateRight",
                    "def": "bitRotateRight(a, b)",
                    "docText": ""
                },
                {
                    "name": "bitTest",
                    "def": "bitTest(number, index)",
                    "docText": "Takes any integer and converts it into binary form, returns the value of a bit at " +
                      "specified position.\n" +
                      "The countdown starts from 0 from the right to the left.\n" +
                      "Parameters:\n" +
                      "\tnumber – integer number.\n" +
                      "\tindex – position of bit.\n" +
                      "Returned values:\n" +
                      "\tReturns a value of bit at specified position."
                },
                {
                    "name": "bitTestAll",
                    "def": "bitTestAll(number, index1, ..., indexN)",
                    "docText": "Returns result of logical conjunction (AND operator) of all bits at given positions. " +
                      "The countdown starts from 0 from the right to the left.\n" +
                      "Parameters:\n" +
                      "\tnumber – integer number.\n" +
                      "\tindex1, index2, index3, index4 – positions of bit.\n" +
                      "\t\tFor example, for set of positions (index1, index2, index3, index4) is true if and only if " +
                      "all of its positions are true (index1 ⋀ index2, ⋀ index3 ⋀ index4).\n" +
                      "Returned values:\n" +
                      "\tReturns result of logical conjunction. UInt8."
                },
                {
                    "name": "bitTestAny",
                    "def": "bitTestAny(number, index1, ..., indexN)",
                    "docText": "Returns result of logical disjunction (OR operator) of all bits at given positions. " +
                      "The countdown starts from 0 from the right to the left.\n" +
                      "Returns result of logical disjuction."
                },
                {
                    "name": "bitCount",
                    "def": "bitCount(x)",
                    "docText": "Calculates the number of bits set to one in the binary representation of a number.\n" +
                      "x — Integer or floating-point number. The function uses the value representation in memory. " +
                      "It allows supporting floating-point numbers."
                }
            ];
            
            var bitmapFunctionsCompletions = [
                {
                    "name": "bitmapBuild",
                    "def": "bitmapBuild(array)",
                    "docText": "Build a bitmap from unsigned integer array.\n" +
                      "array – unsigned integer array."
                },
                {
                    "name": "bitmapToArray",
                    "def": "bitmapToArray(bitmap)",
                    "docText": "Convert bitmap to integer array."
                },
                {
                    "name": "bitmapSubsetInRange",
                    "def": "bitmapSubsetInRange(bitmap, range_start, range_end)",
                    "docText": "Return subset in specified range (not include the range_end).\n" +
                      "\tbitmap – Bitmap object.\n" +
                      "\trange_start – range start point. Type: UInt32.\n" +
                      "\trange_end – range end point(excluded). Type: UInt32."
                },
                {
                    "name": "bitmapSubsetLimit",
                    "def": "bitmapSubsetLimit(bitmap, range_start, cardinality_limit)",
                    "docText": "Creates a subset of bitmap with n elements taken between range_start and " +
                      "cardinality_limit.\n" +
                      "\tbitmap – Bitmap object.\n" +
                      "\trange_start – The subset starting point. Type: UInt32.\n" +
                      "\tcardinality_limit – The subset cardinality upper limit. Type: UInt32."
                },
                {
                    "name": "bitmapContains",
                    "def": "bitmapContains(haystack, needle)",
                    "docText": "Checks whether the bitmap contains an element.\n" +
                      "Parameters:\n" +
                      "\thaystack – Bitmap object, where the function searches.\n" +
                      "\tneedle – Value that the function searches. Type: UInt32.\n" +
                      "Returned values:\n" +
                      "\t0 — If haystack doesn’t contain needle.\n" +
                      "\t1 — If haystack contains needle.\n" +
                      "Type: UInt8."
                },
                {
                    "name": "bitmapHasAny",
                    "def": "bitmapHasAny(bitmap1, bitmap2)",
                    "docText": "Checks whether two bitmaps have intersection by some elements.\n" +
                      "If you are sure that bitmap2 contains strictly one element, consider using the " +
                      "bitmapContains function. It works more efficiently.\n" +
                      "Parameters:\n" +
                      "\tbitmap* – bitmap object.\n" +
                      "Return values:\n" +
                      "\t1, if bitmap1 and bitmap2 have one similar element at least.\n" +
                      "\t0, otherwise.\n"
                },
                {
                    "name": "bitmapHasAll",
                    "def": "bitmapHasAll(bitmap1, bitmap2)",
                    "docText": "Analogous to hasAll(array, array) returns 1 if the first bitmap contains all the " +
                      "elements of the second one, 0 otherwise.\n" +
                      "If the second argument is an empty bitmap then returns 1"
                },
                {
                    "name": "bitmapCardinality",
                    "def": "bitmapCardinality(bitmap)",
                    "docText": "Returns bitmap cardinality of type UInt64."
                },
                {
                    "name": "bitmapMin",
                    "def": "bitmapMin(bitmap)",
                    "docText": "Returns the smallest value of type UInt64 in the set, UINT32_MAX if the set is empty."
                },
                {
                    "name": "bitmapMax",
                    "def": "bitmapMin(bitmap)",
                    "docText": "Returns the biggest value of type UInt64 in the set, 0 if the set is empty."
                },
                {
                    "name": "bitmapTransform",
                    "def": "bitmapTransform(bitmap, from_array, to_array)",
                    "docText": "Transform an array of values in a bitmap to another array of values, " +
                      "the result is a new bitmap.\n" +
                      "\tbitmap – bitmap object.\n" +
                      "\tfrom_array – UInt32 array. " +
                      "For idx in range [0, from_array.size()), if bitmap contains from_array[idx], " +
                      "then replace it with to_array[idx]. " +
                      "Note that the result depends on array ordering if there are common elements between " +
                      "from_array and to_array.\n" +
                      "\tto_array – UInt32 array, its size shall be the same to from_array."
                },
                {
                    "name": "bitmapAnd",
                    "def": "bitmapAnd(bitmap, bitmap)",
                    "docText": "Two bitmap and calculation, the result is a new bitmap."
                },
                {
                    "name": "bitmapOr",
                    "def": "bitmapOr(bitmap, bitmap)",
                    "docText": "Two bitmap or calculation, the result is a new bitmap."
                },
                {
                    "name": "bitmapXor",
                    "def": "bitmapXor(bitmap, bitmap)",
                    "docText": "Two bitmap xor calculation, the result is a new bitmap."
                },
                {
                    "name": "bitmapAndnot",
                    "def": "bitmapAndnot(bitmap, bitmap)",
                    "docText": "Two bitmap andnot calculation, the result is a new bitmap."
                },
                {
                    "name": "bitmapAndCardinality",
                    "def": "bitmapAndCardinality(bitmap, bitmap)",
                    "docText": "Two bitmap and calculation, return cardinality of type UInt64."
                },
                {
                    "name": "bitmapOrCardinality",
                    "def": "bitmapOrCardinality(bitmap, bitmap)",
                    "docText": "Two bitmap or calculation, return cardinality of type UInt64."
                },
                {
                    "name": "bitmapXorCardinality",
                    "def": "bitmapXorCardinality(bitmap, bitmap)",
                    "docText": "Two bitmap xor calculation, return cardinality of type UInt64."
                },
                {
                    "name": "bitmapAndnotCardinality",
                    "def": "bitmapAndnotCardinality(bitmap, bitmap)",
                    "docText": "Two bitmap andnot calculation, return cardinality of type UInt64."
                }
            ];
            
            var hashFunctionsCompletions = [
                {
                    "name": "halfMD5",
                    "def": "halfMD5(par1, ...)",
                    "docText": "Interprets all the input parameters as strings and calculates the MD5 hash value for " +
                      "each of them.\n" +
                      "Then combines hashes, takes the first 8 bytes of the hash of the resulting string, and " +
                      "interprets them as UInt64 in big-endian byte order.\n" +
                      "The function is relatively slow (5 million short strings per second per processor core).\n" +
                      "Consider using the sipHash64 function instead."
                },
                {
                    "name": "MD5",
                    "def": "MD5(str)",
                    "docText": "Calculates the MD5 from a string and returns the resulting set of bytes as " +
                      "FixedString(16).\n" +
                      "If you don’t need MD5 in particular, but you need a decent cryptographic 128-bit hash, " +
                      "use the ‘sipHash128’ function instead.\n" +
                      "If you want to get the same result as output by the md5sum utility, use lower(hex(MD5(s)))."
                },
                {
                    "name": "sipHash64",
                    "def": "sipHash64(par1,...)",
                    "docText": "This is a cryptographic hash function. It works at least three times faster than the " +
                      "MD5 function.\n" +
                      "\n" +
                      "Function interprets all the input parameters as strings and calculates the hash value for " +
                      "each of them. Then combines hashes by the following algorithm:\n" +
                      "\n" +
                      "After hashing all the input parameters, the function gets the array of hashes.\n" +
                      "Function takes the first and the second elements and calculates a hash for the array of them.\n" +
                      "Then the function takes the hash value, calculated at the previous step, and the third " +
                      "element of the initial hash array, and calculates a hash for the array of them.\n" +
                      "The previous step is repeated for all the remaining elements of the initial hash array."
                },
                {
                    "name": "sipHash128",
                    "def": "sipHash128(str)",
                    "docText": "Calculates SipHash from a string.\n" +
                      "Accepts a String-type argument. Returns FixedString(16).\n" +
                      "Differs from sipHash64 in that the final xor-folding state is only done up to 128 bits."
                },
                {
                    "name": "cityHash64",
                    "def": "cityHash64(par1,...)",
                    "docText": "This is a fast non-cryptographic hash function.\n" +
                      "It uses the CityHash algorithm for string parameters and implementation-specific fast " +
                      "non-cryptographic hash function for parameters with other data types.\n" +
                      "The function uses the CityHash combinator to get the final results."
                },
                {
                    "name": "intHash32",
                    "def": "intHash32(integer)",
                    "docText": "Calculates a 32-bit hash code from any type of integer.\n" +
                      "This is a relatively fast non-cryptographic hash function of average quality for numbers."
                },
                {
                    "name": "intHash64",
                    "def": "intHash64(integer)",
                    "docText": "Calculates a 64-bit hash code from any type of integer.\n" +
                      "It works faster than intHash32. Average quality"
                },
                {
                    "name": "SHA1",
                    "def": "SHA1(str)",
                    "docText": "Calculates SHA-1 from a string and returns the resulting set of bytes as " +
                      "FixedString(20).\n" +
                      "The function works fairly slowly " +
                      "(SHA-1 processes about 5 million short strings per second per processor core).\n" +
                      "We recommend using this function only in cases when you need a specific hash function and " +
                      "you can’t select it.\n" +
                      "Even in these cases, we recommend applying the function offline and pre-calculating values " +
                      "when inserting them into the table, instead of applying it in SELECTS."
                },
                {
                    "name": "SHA224",
                    "def": "SHA224(str)",
                    "docText": "Calculates SHA-224 from a string and returns the resulting set of bytes as " +
                      "FixedString(28).\n" +
                      "SHA-224 process about 2.2 million short strings per second per processor core."
                },
                {
                    "name": "SHA256",
                    "def": "SHA256(str)",
                    "docText": "Calculates SHA-256 from a string and returns the resulting set of bytes as " +
                      "FixedString(32).\n" +
                      "SHA-256 process about 2.2 million short strings per second per processor core."
                },
                {
                    "name": "URLHash",
                    "def": "URLHash(url[, N])",
                    "docText": "A fast, decent-quality non-cryptographic hash function for a string obtained from a " +
                      "URL using some type of normalization.\n" +
                      "URLHash(s) – Calculates a hash from a string without one of the trailing symbols /,? or # at " +
                      "the end, if present.\n" +
                      "URLHash(s, N) – Calculates a hash from a string up to the N level in the URL hierarchy, " +
                      "without one of the trailing symbols /,? or # at the end, if present.\n" +
                      "Levels are the same as in URLHierarchy. This function is specific to Yandex.Metrica."
                },
                {
                    "name": "farmHash64",
                    "def": "farmHash64(par1, ...)",
                    "docText": "Produces a 64-bit FarmHash hash value.\n" +
                      "The function uses the Hash64 method from all available methods."
                },
                {
                    "name": "javaHash",
                    "def": "javaHash(str)",
                    "docText": "Calculates JavaHash from a string.\n" +
                      "This hash function is neither fast nor having a good quality.\n" +
                      "The only reason to use it is when this algorithm is already used in another system and you " +
                      "have to calculate exactly the same result."
                },
                {
                    "name": "javaHashUTF16LE",
                    "def": "javaHashUTF16LE(stringUtf16le)",
                    "docText": "Calculates JavaHash from a string, assuming it contains bytes representing a string " +
                      "in UTF-16LE encoding."
                },
                {
                    "name": "hiveHash",
                    "def": "hiveHash(str)",
                    "docText": "Calculates HiveHash from a string.\n" +
                      "This is just JavaHash with zeroed out sign bit.\n" +
                      "This function is used in Apache Hive for versions before 3.0. This hash function is neither " +
                      "fast nor having a good quality.\n" +
                      "The only reason to use it is when this algorithm is already used in another system and " +
                      "you have to calculate exactly the same result."
                },
                {
                    "name": "metroHash64",
                    "def": "metroHash64(par1, ...)",
                    "docText": "Produces a 64-bit MetroHash hash value."
                },
                {
                    "name": "jumpConsistentHash",
                    "def": "jumpConsistentHash(uint64num)",
                    "docText": "Calculates JumpConsistentHash form a UInt64.\n" +
                      "Accepts two arguments: a UInt64-type key and the number of buckets. Returns Int32.\n" +
                      "For more information, see the link: JumpConsistentHash"
                },
                {
                    "name": "murmurHash2_32",
                    "def": "murmurHash2_32(par1, ...)",
                    "docText": "Produces a UInt32 MurmurHash2 hash value."
                },
                {
                    "name": "murmurHash2_64",
                    "def": "murmurHash2_64(par1, ...)",
                    "docText": "Produces a UInt64 MurmurHash2 hash value."
                },
                {
                    "name": "gccMurmurHash",
                    "def": "gccMurmurHash(par1, ...)",
                    "docText": "Calculates a 64-bit MurmurHash2 hash value using the same hash seed as gcc.\n" +
                      "It is portable between CLang and GCC builds."
                },
                {
                    "name": "murmurHash3_32",
                    "def": "murmurHash3_32(par1, ...)",
                    "docText": "Produces a UInt32 MurmurHash3 hash value."
                },
                {
                    "name": "murmurHash3_64",
                    "def": "murmurHash3_64(par1, ...)",
                    "docText": "Produces a UInt64 MurmurHash3 hash value."
                },
                {
                    "name": "murmurHash3_128",
                    "def": "murmurHash3_128(expr)",
                    "docText": "Produces a FixedString(16) 128-bit MurmurHash3 hash value.\n" +
                      "expr — Expressions returning a String-type value."
                },
                {
                    "name": "xxHash32",
                    "def": "xxHash32(str)",
                    "docText": "Calculates Uint32 xxHash from a string"
                },
                {
                    "name": "xxHash64",
                    "def": "xxHash64(str)",
                    "docText": "Calculates Uint64 xxHash from a string"
                }
            ];
            
            var pseudoRandomNumbersFunctionsCompletions = [
                {
                    "name": "rand",
                    "def": "rand()",
                    "docText": "Returns a pseudo-random UInt32 number, " +
                      "evenly distributed among all UInt32-type numbers.\n" +
                      "Uses a linear congruential generator."
                },
                {
                    "name": "rand32",
                    "def": "rand32()",
                    "docText": "Returns a pseudo-random UInt32 number, " +
                      "evenly distributed among all UInt32-type numbers.\n" +
                      "Uses a linear congruential generator."
                },
                {
                    "name": "rand64",
                    "def": "rand64()",
                    "docText": "Returns a pseudo-random UInt64 number, " +
                      "evenly distributed among all UInt64-type numbers.\n" +
                      "Uses a linear congruential generator."
                },
                {
                    "name": "randConstant",
                    "def": "randConstant([x])",
                    "docText": "Produces a constant column with a random value.\n" +
                      "x — Optional expression resulting in any of the supported data types.\n" +
                      "The resulting value is discarded, but the expression itself if used for bypassing common " +
                      "subexpression elimination if the function is called multiple times in one query."
                },
                {
                    "name": "randomString",
                    "def": "randomString(size)",
                    "docText": ""
                },
                {
                    "name": "randomFixedString",
                    "def": "randomFixedString(size)",
                    "docText": ""
                },
                {
                    "name": "randomPrintableASCII",
                    "def": "randomPrintableASCII(size)",
                    "docText": ""
                },
                {
                    "name": "randomStringUTF8",
                    "def": "randomStringUTF8(size)",
                    "docText": ""
                },
                {
                    "name": "fuzzBits",
                    "def": "fuzzBits([s], [prob])",
                    "docText": "Inverts bits of s, each with probability prob.\n" +
                      "\ts - String or FixedString\n" +
                      "\tprob - constant Float32/64"
                }
            ];
            
            var encodingFunctionsCompletions = [
                {
                    "name": "char",
                    "def": "char(number_1, [number_2, ..., number_n])",
                    "docText": "Returns the string with the length as the number of passed arguments and each byte " +
                      "has the value of corresponding argument. Accepts multiple arguments of numeric types.\n" +
                      "If the value of argument is out of range of UInt8 data type, it is converted to UInt8 with " +
                      "possible rounding and overflow."
                },
                {
                    "name": "hex",
                    "def": "hex()",
                    "docText": "Returns a string containing the argument’s hexadecimal representation.\n" +
                      "The function is using uppercase letters A-F and not using any prefixes (like 0x) " +
                      "or suffixes (like h).\n" +
                      "For integer arguments, it prints hex digits (“nibbles”) from the most significant to " +
                      "least significant (big endian or “human readable” order).\n" +
                      "It starts with the most significant non-zero byte (leading zero bytes are omitted) but " +
                      "always prints both digits of every byte even if leading digit is zero."
                },
                {
                    "name": "unhex",
                    "def": "unhex(str)",
                    "docText": "Accepts a string containing any number of hexadecimal digits, and returns a string " +
                      "containing the corresponding bytes. Supports both uppercase and lowercase letters A-F.\n" +
                      "The number of hexadecimal digits does not have to be even.\n" +
                      "If it is odd, the last digit is interpreted as the least significant half of the 00-0F byte.\n" +
                      "If the argument string contains anything other than hexadecimal digits, some " +
                      "implementation-defined result is returned (an exception isn’t thrown).\n" +
                      "If you want to convert the result to a number, you can use the ‘reverse’ and " +
                      "‘reinterpretAsType’ functions."
                },
                {
                    "name": "UUIDStringToNum",
                    "def": "UUIDStringToNum(str)",
                    "docText": "Accepts a string containing 36 characters in the format " +
                      "123e4567-e89b-12d3-a456-426655440000, and returns it as a set of bytes in a FixedString(16)."
                },
                {
                    "name": "UUIDNumToString",
                    "def": "UUIDNumToString(str)",
                    "docText": "Accepts a FixedString(16) value.\n" +
                      "Returns a string containing 36 characters in text format."
                },
                {
                    "name": "bitmaskToList",
                    "def": "bitmaskToList(num)",
                    "docText": "Accepts an integer.\n" +
                      "Returns a string containing the list of powers of two that total the source number " +
                      "when summed.\n" +
                      "They are comma-separated without spaces in text format, in ascending order."
                },
                {
                    "name": "bitmaskToArray",
                    "def": "bitmaskToArray(num)",
                    "docText": "AAccepts an integer.\n" +
                      "Returns an array of UInt64 numbers containing the list of powers of two that total the source " +
                      "number when summed.\n" +
                      "Numbers in the array are in ascending order."
                }
            ];
            
            var uuidFunctionsCompletions = [
                {
                    "name": "generateUUIDv4",
                    "def": "generateUUIDv4()",
                    "docText": "Generates the UUID of version 4."
                },
                {
                    "name": "toUUID",
                    "def": "toUUID(x)",
                    "docText": "Converts String type value to UUID type."
                },
                {
                    "name": "UUIDStringToNum",
                    "def": "UUIDStringToNum(str)",
                    "docText": "Accepts a string containing 36 characters in the format " +
                      "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, and returns it as a set of bytes in a FixedString(16)."
                },
                {
                    "name": "UUIDNumToString",
                    "def": "UUIDNumToString(str)",
                    "docText": "Accepts a FixedString(16) value, " +
                      "and returns a string containing 36 characters in text format."
                }
            ];
            
            var urlFunctionsCompletions = [
                {
                    "name": "protocol",
                    "def": "protocol(url)",
                    "docText": "Extracts the protocol from a URL.\n" +
                      "Examples of typical returned values: http, https, ftp, mailto, tel, magnet…"
                },
                {
                    "name": "domain",
                    "def": "domain(url)",
                    "docText": "Extracts the hostname from a URL."
                },
                {
                    "name": "domainWithoutWWW",
                    "def": "domainWithoutWWW(url)",
                    "docText": "Returns the domain and removes no more than one ‘www.’ from the beginning of it, if present."
                },
                {
                    "name": "topLevelDomain",
                    "def": "topLevelDomain(url)",
                    "docText": "Extracts the top-level domain from a URL."
                },
                {
                    "name": "firstSignificantSubdomain",
                    "def": "firstSignificantSubdomain(url)",
                    "docText": "Returns the “first significant subdomain”.\n" +
                      "This is a non-standard concept specific to Yandex.Metrica.\n" +
                      "The first significant subdomain is a second-level domain if it is " +
                      "‘com’, ‘net’, ‘org’, or ‘co’.\n" +
                      "Otherwise, it is a third-level domain.\n" +
                      "For example, firstSignificantSubdomain (‘https://news.yandex.ru/’) = ‘yandex’, " +
                      "firstSignificantSubdomain (‘https://news.yandex.com.tr/’) = ‘yandex’.\n" +
                      "The list of “insignificant” second-level domains and other implementation details may change " +
                      "in the future."
                },
                {
                    "name": "cutToFirstSignificantSubdomain",
                    "def": "cutToFirstSignificantSubdomain(url)",
                    "docText": "Returns the part of the domain that includes top-level subdomains up to the " +
                      "“first significant subdomain” (see the explanation above).\n" +
                      "For example, cutToFirstSignificantSubdomain('https://news.yandex.com.tr/') = 'yandex.com.tr'."
                },
                {
                    "name": "port",
                    "def": "port(URL[, default_port = 0])",
                    "docText": "Returns the port or default_port if there is no port in the URL " +
                      "(or in case of validation error)."
                },
                {
                    "name": "pathFull",
                    "def": "pathFull(url)",
                    "docText": "Returns the path, including query string and fragment.\n" +
                      "Example: /top/news.html?page=2#comments"
                },
                {
                    "name": "path",
                    "def": "path(url)",
                    "docText": "Returns the path.\n" +
                      "Example: /top/news.html The path does not include the query string."
                },
                {
                    "name": "queryString",
                    "def": "queryString(url)",
                    "docText": "Returns the query string.\n" +
                      "Example: page=1&lr=213. query-string does not include the initial question mark, " +
                      "as well as # and everything after #."
                },
                {
                    "name": "fragment",
                    "def": "fragment(url)",
                    "docText": "Returns the fragment identifier. fragment does not include the initial hash symbol."
                },
                {
                    "name": "queryStringAndFragment",
                    "def": "queryStringAndFragment(url)",
                    "docText": "Returns the query string and fragment identifier. Example: page=1#29390."
                },
                {
                    "name": "extractURLParameter",
                    "def": "extractURLParameter(URL, name)",
                    "docText": "Returns the value of the ‘name’ parameter in the URL, if present.\n" +
                      "Otherwise, an empty string.\n" +
                      "If there are many parameters with this name, it returns the first occurrence.\n" +
                      "This function works under the assumption that the parameter name is encoded in the URL " +
                      "exactly the same way as in the passed argument."
                },
                {
                    "name": "extractURLParameters",
                    "def": "extractURLParameters(URL)",
                    "docText": "Returns an array of name=value strings corresponding to the URL parameters.\n" +
                      "The values are not decoded in any way."
                },
                {
                    "name": "extractURLParameterNames",
                    "def": "extractURLParameterNames(URL)",
                    "docText": "Returns an array of name strings corresponding to the names of URL parameters.\n" +
                      "The values are not decoded in any way."
                },
                {
                    "name": "URLHierarchy",
                    "def": "URLHierarchy(URL)",
                    "docText": "Returns an array containing the URL, truncated at the end by the symbols /,? " +
                      "in the path and query-string.\n" +
                      "Consecutive separator characters are counted as one.\n" +
                      "The cut is made in the position after all the consecutive separator characters."
                },
                {
                    "name": "URLPathHierarchy",
                    "def": "URLPathHierarchy(URL)",
                    "docText": "The same as above, but without the protocol and host in the result.\n" +
                      "The / element (root) is not included.\n" +
                      "Example: the function is used to implement tree reports the URL in Yandex. Metric."
                },
                {
                    "name": "decodeURLComponent",
                    "def": "decodeURLComponent(URL)",
                    "docText": "Returns the decoded URL."
                },
                {
                    "name": "netloc",
                    "def": "netloc(URL)",
                    "docText": "Extracts network locality (username:password@host:port) from a URL."
                },
                {
                    "name": "cutWWW",
                    "def": "cutWWW(URL)",
                    "docText": "Removes no more than one ‘www.’ from the beginning of the URL’s domain, if present."
                },
                {
                    "name": "cutQueryString",
                    "def": "cutQueryString(URL)",
                    "docText": "Removes query string. The question mark is also removed."
                },
                {
                    "name": "cutFragment",
                    "def": "cutFragment(URL)",
                    "docText": "Removes the fragment identifier. The number sign is also removed."
                },
                {
                    "name": "cutQueryStringAndFragment",
                    "def": "cutQueryStringAndFragment(URL)",
                    "docText": "Removes the query string and fragment identifier.\n" +
                      "The question mark and number sign are also removed."
                },
                {
                    "name": "cutURLParameter",
                    "def": "cutURLParameter(URL, name)",
                    "docText": "Removes the ‘name’ URL parameter, if present.\n" +
                      "This function works under the assumption that the parameter name is encoded in the URL " +
                      "exactly the same way as in the passed argument."
                }
            ];
            
            var ipFunctionsCompletions = [
                {
                    "name": "IPv4NumToString",
                    "def": "IPv4NumToString(num)",
                    "docText": "Takes a UInt32 number. Interprets it as an IPv4 address in big endian.\n" +
                      "Returns a string containing the corresponding IPv4 address in the format A.B.C.d " +
                      "(dot-separated numbers in decimal form)."
                },
                {
                    "name": "IPv4StringToNum",
                    "def": "IPv4StringToNum(s)",
                    "docText": "Takes a String containing the corresponding IPv4 address in the format A.B.C.d " +
                      "and returns a UInt32 number number.\n" +
                      "If the IPv4 address has an invalid format, it returns 0."
                },
                {
                    "name": "IPv4NumToStringClassC",
                    "def": "IPv4NumToStringClassC(num)",
                    "docText": "Takes a UInt32 number. Interprets it as an IPv4 address in big endian.\n" +
                      "Returns a string containing the corresponding IPv4 address in the format A.B.C.xxx " +
                      "(dot-separated numbers in decimal form)."
                },
                {
                    "name": "IPv6NumToString",
                    "def": "IPv6NumToString(x)",
                    "docText": "Accepts a FixedString(16) value containing the IPv6 address in binary format.\n" +
                      "Returns a string containing this address in text format.\n" +
                      "IPv6-mapped IPv4 addresses are output in the format ::ffff:111.222.33.44."
                },
                {
                    "name": "IPv6StringToNum",
                    "def": "IPv6StringToNum(s)",
                    "docText": "The reverse function of IPv6NumToString.\n" +
                      "If the IPv6 address has an invalid format, it returns a string of null bytes.\n" +
                      "HEX can be uppercase or lowercase."
                },
                {
                    "name": "IPv4ToIPv6",
                    "def": "IPv4ToIPv6(x)",
                    "docText": "Takes a UInt32 number.\n" +
                      "Interprets it as an IPv4 address in big endian.\n" +
                      "Returns a FixedString(16) value containing the IPv6 address in binary format."
                },
                {
                    "name": "cutIPv6",
                    "def": "cutIPv6(x, bytesToCutForIPv6, bytesToCutForIPv4)",
                    "docText": "Accepts a FixedString(16) value containing the IPv6 address in binary format.\n" +
                      "Returns a string containing the address of the specified number of bytes removed in text format."
                },
                {
                    "name": "IPv4CIDRToRange",
                    "def": "IPv4CIDRToRange(ipv4, Cidr)",
                    "docText": "\n" +
                      "Accepts an IPv4 and an UInt8 value containing the CIDR.\n" +
                      "Return a tuple with two IPv4 containing the lower range and the higher range of the subnet."
                },
                {
                    "name": "IPv6CIDRToRange",
                    "def": "IPv6CIDRToRange(ipv6, Cidr)",
                    "docText": "\n" +
                      "Accepts an IPv6 and an UInt8 value containing the CIDR.\n" +
                      "Return a tuple with two IPv6 containing the lower range and the higher range of the subnet."
                },
                {
                    "name": "toIPv4",
                    "def": "toIPv4(str)",
                    "docText": "\n" +
                      "An alias to IPv4StringToNum() that takes a string form of IPv4 address and returns value of " +
                      "IPv4 type, which is binary equal to value returned by IPv4StringToNum()."
                },
                {
                    "name": "toIPv6",
                    "def": "toIPv6(str)",
                    "docText": "\n" +
                      "An alias to IPv6StringToNum() that takes a string form of IPv6 address and returns value of " +
                      "IPv6 type, which is binary equal to value returned by IPv6StringToNum()."
                }
            ];
            
            var jsonFunctionsCompletions = [
                {
                    "name": "visitParamHas",
                    "def": "visitParamHas(params, name)",
                    "docText": "Checks whether there is a field with the ‘name’ name."
                },
                {
                    "name": "visitParamExtractUInt",
                    "def": "visitParamExtractUInt(params, name)",
                    "docText": "Parses UInt64 from the value of the field named ‘name’.\n" +
                      "If this is a string field, it tries to parse a number from the beginning of the string.\n" +
                      "If the field doesn’t exist, or it exists but doesn’t contain a number, it returns 0."
                },
                {
                    "name": "visitParamExtractInt",
                    "def": "visitParamExtractInt(params, name)",
                    "docText": "Parses Int64 from the value of the field named ‘name’.\n" +
                      "If this is a string field, it tries to parse a number from the beginning of the string.\n" +
                      "If the field doesn’t exist, or it exists but doesn’t contain a number, it returns 0."
                },
                {
                    "name": "visitParamExtractFloat",
                    "def": "visitParamExtractFloat(params, name)",
                    "docText": "Parses Float64 from the value of the field named ‘name’.\n" +
                      "If this is a string field, it tries to parse a number from the beginning of the string.\n" +
                      "If the field doesn’t exist, or it exists but doesn’t contain a number, it returns 0."
                },
                {
                    "name": "visitParamExtractBool",
                    "def": "visitParamExtractBool(params, name)",
                    "docText": "Parses UInt8 from the value of the field named ‘name’.\n" +
                      "If this is a string field, it tries to parse a number from the beginning of the string.\n" +
                      "If the field doesn’t exist, or it exists but doesn’t contain a number, it returns 0."
                },
                {
                    "name": "visitParamExtractRaw",
                    "def": "visitParamExtractRaw(params, name)",
                    "docText": "Returns the value of a field, including separators."
                },
                {
                    "name": "visitParamExtractString",
                    "def": "visitParamExtractString(params, name)",
                    "docText": "Parses the string in double quotes.\n" +
                      "The value is unescaped.\n" +
                      "If unescaping failed, it returns an empty string."
                },
                {
                    "name": "isValidJSON",
                    "def": "isValidJSON(json)",
                    "docText": "Checks that passed string is a valid json."
                },
                {
                    "name": "JSONHas",
                    "def": "JSONHas(json[, indices_or_keys]…)",
                    "docText": "If the value exists in the JSON document, 1 will be returned.\n" +
                      "If the value does not exist, 0 will be returned."
                },
                {
                    "name": "JSONLength",
                    "def": "JSONLength(json[, indices_or_keys]…)",
                    "docText": "Return the length of a JSON array or a JSON object.\n" +
                      "If the value does not exist or has a wrong type, 0 will be returned."
                },
                {
                    "name": "JSONType",
                    "def": "JSONType(json[, indices_or_keys]…)",
                    "docText": "Return the type of a JSON value.\n" +
                      "If the value does not exist, Null will be returned."
                },
                {
                    "name": "JSONExtractUInt",
                    "def": "JSONExtractUInt(json[, indices_or_keys]…)",
                    "docText": "Parses a JSON and extract an UInt value.\n" +
                      "If the value does not exist or has a wrong type, 0 will be returned."
                },
                {
                    "name": "JSONExtractInt",
                    "def": "JSONExtractInt(json[, indices_or_keys]…)",
                    "docText": "Parses a JSON and extract an Int value.\n" +
                      "If the value does not exist or has a wrong type, 0 will be returned."
                },
                {
                    "name": "JSONExtractFloat",
                    "def": "JSONExtractFloat(json[, indices_or_keys]…)",
                    "docText": "Parses a JSON and extract an Float value.\n" +
                      "If the value does not exist or has a wrong type, 0 will be returned."
                },
                {
                    "name": "JSONExtractBool",
                    "def": "JSONExtractBool(json[, indices_or_keys]…)",
                    "docText": "Parses a JSON and extract an UInt8 value.\n" +
                      "If the value does not exist or has a wrong type, 0 will be returned."
                },
                {
                    "name": "JSONExtractString",
                    "def": "JSONExtractString(json[, indices_or_keys]…)",
                    "docText": "Parses a JSON and extract a string. This function is similar to " +
                      "visitParamExtractString functions.\n" +
                      "If the value does not exist or has a wrong type, an empty string will be returned.\n" +
                      "The value is unescaped. If unescaping failed, it returns an empty string."
                },
                {
                    "name": "JSONExtract",
                    "def": "JSONExtract(json[, indices_or_keys]…, Return_type)",
                    "docText": "Parses a JSON and extract a value of the given ClickHouse data type.\n" +
                      "This is a generalization of the previous JSONExtract<type> functions."
                },
                {
                    "name": "JSONExtractKeysAndValues",
                    "def": "JSONExtractKeysAndValues(json[, indices_or_keys]…, Value_type)",
                    "docText": "Parses key-value pairs from a JSON where the values are of the given ClickHouse " +
                      "data type."
                },
                {
                    "name": "JSONExtractRaw",
                    "def": "JSONExtractRaw(json[, indices_or_keys]…)",
                    "docText": "Returns a part of JSON as unparsed string.\n" +
                      "If the part does not exist or has a wrong type, an empty string will be returned."
                },
                {
                    "name": "JSONExtractArrayRaw",
                    "def": "JSONExtractArrayRaw(json[, indices_or_keys]…)",
                    "docText": "Returns an array with elements of JSON array, each represented as unparsed string.\n" +
                      "If the part does not exist or isn’t array, an empty array will be returned."
                },
                {
                    "name": "JSONExtractKeysAndValuesRaw",
                    "def": "JSONExtractKeysAndValuesRaw(json)",
                    "docText": "Extracts raw data from a JSON object."
                }
            ];
            
            var higherOrderFunctionsCompletions = [
                {
                    "name": "lambda",
                    "def": "lambda(params, expr)",
                    "docText": "-> operator\n" +
                      "Allows describing a lambda function for passing to a higher-order function.\n" +
                      "The left side of the arrow has a formal parameter, which is any ID, or multiple formal " +
                      "parameters – any IDs in a tuple.\n" +
                      "The right side of the arrow has an expression that can use these formal parameters, " +
                      "as well as any table columns.\n" +
                      "A lambda function that accepts multiple arguments can be passed to a higher-order function.\n" +
                      "In this case, the higher-order function is passed several arrays of identical length that " +
                      "these arguments will correspond to."
                },
                {
                    "name": "arrayMap",
                    "def": "arrayMap(func, arr1, …)",
                    "docText": "Returns an array obtained from the original application of the func function to each " +
                      "element in the arr array."
                },
                {
                    "name": "arrayFilter",
                    "def": "arrayFilter(func, arr1, …)",
                    "docText": "Returns an array containing only the elements in arr1 for which func returns " +
                      "something other than 0."
                },
                {
                    "name": "arrayFill",
                    "def": "arrayFill(func, arr1, …)",
                    "docText": "Scan through arr1 from the first element to the last element and replace arr1[i] by " +
                      "arr1[i - 1] if func returns 0. The first element of arr1 will not be replaced."
                },
                {
                    "name": "arrayReverseFill",
                    "def": "arrayReverseFill(func, arr1, …)",
                    "docText": "Scan through arr1 from the last element to the first element and replace arr1[i] by " +
                      "arr1[i + 1] if func returns 0. The last element of arr1 will not be replaced."
                },
                {
                    "name": "arraySplit",
                    "def": "arraySplit(func, arr1, …)",
                    "docText": "Split arr1 into multiple arrays.\n" +
                      "When func returns something other than 0, the array will be split on the left hand side of " +
                      "the element.\n" +
                      "The array will not be split before the first element."
                },
                {
                    "name": "arrayReverseSplit",
                    "def": "arrayReverseSplit(func, arr1, …)",
                    "docText": "Split arr1 into multiple arrays.\n" +
                      "When func returns something other than 0, the array will be split on the right hand side of " +
                      "the element.\n" +
                      "The array will not be split after the last element."
                },
                {
                    "name": "arrayCount",
                    "def": "arrayCount([func, ]arr1, …)",
                    "docText": "Returns the number of elements in the arr array for which func returns something " +
                      "other than 0.\n" +
                      "If ‘func’ is not specified, it returns the number of non-zero elements in the array."
                },
                {
                    "name": "arrayExists",
                    "def": "arrayExists([func, ]arr1, …)",
                    "docText": "Returns 1 if there is at least one element in ‘arr’ for which ‘func’ returns " +
                      "something other than 0. Otherwise, it returns 0."
                },
                {
                    "name": "arrayAll",
                    "def": "arrayAll([func, ]arr1, …)",
                    "docText": "Returns 1 if ‘func’ returns something other than 0 for all the elements in ‘arr’.\n" +
                      "Otherwise, it returns 0."
                },
                {
                    "name": "arraySum",
                    "def": "arraySum([func, ]arr1, …)",
                    "docText": "Returns the sum of the ‘func’ values.\n" +
                      "If the function is omitted, it just returns the sum of the array elements."
                },
                {
                    "name": "arrayFirst",
                    "def": "arrayFirst(func, arr1, …)",
                    "docText": "Returns the first element in the ‘arr1’ array for which ‘func’ returns something " +
                      "other than 0."
                },
                {
                    "name": "arrayFirstIndex",
                    "def": "arrayFirstIndex(func, arr1, …)",
                    "docText": "Returns the index of the first element in the ‘arr1’ array for which ‘func’ returns " +
                      "something other than 0."
                },
                {
                    "name": "arrayCumSum",
                    "def": "arrayCumSum(func, arr1, …)",
                    "docText": "Returns an array of partial sums of elements in the source array (a running sum).\n" +
                      "If the func function is specified, then the values of the array elements are converted by " +
                      "this function before summing."
                },
                {
                    "name": "arrayCumSumNonNegative",
                    "def": "arrayCumSumNonNegative(arr)",
                    "docText": "Same as arrayCumSum, returns an array of partial sums of elements in the source " +
                      "array (a running sum).\n" +
                      "Different arrayCumSum, when then returned value contains a value less than zero, the value " +
                      "is replace with zero and the subsequent calculation is performed with zero parameters."
                },
                {
                    "name": "arraySort",
                    "def": "arraySort([func,] arr1, …)",
                    "docText": "Returns an array as result of sorting the elements of arr1 in ascending order.\n" +
                      "If the func function is specified, sorting order is determined by the result of the function " +
                      "func applied to the elements of array (arrays)\n" +
                      "The Schwartzian transform is used to improve sorting efficiency."
                },
                {
                    "name": "arrayReverseSort",
                    "def": "arrayReverseSort([func,] arr1, …)",
                    "docText": "Returns an array as result of sorting the elements of arr1 in descending order.\n" +
                      "If the func function is specified, sorting order is determined by the result of the " +
                      "function func applied to the elements of array (arrays)."
                }
            ];
            
            var extDictionariesFunctionsCompletions = [
                {
                    "name": "dictGet",
                    "def": "dictGet(dict_name, attr_name, id_expr)",
                    "docText": "Retrieves a value from an external dictionary.\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64 or Tuple-type value depending on the " +
                      "dictionary configuration."
                },
                {
                    "name": "dictGetOrDefault",
                    "def": "dictGetOrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Retrieves a value from an external dictionary.\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64 or Tuple-type value depending on the " +
                      "dictionary configuration.\n" +
                      "\tdefault_value_expr — Value returned if the dictionary doesn’t contain a row with the " +
                      "id_expr key. Expression returning the value in the data type configured for the attr_name " +
                      "attribute."
                },
                {
                    "name": "dictHas",
                    "def": "dictHas(dict_name, id_expr)",
                    "docText": "Checks whether a key is present in a dictionary.\n" +
                      "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tReturned value: UInt8\n" +
                      "\t0, if there is no key.\n" +
                      "\t1, if there is a key."
                },
                {
                    "name": "dictGetHierarchy",
                    "def": "dictGetHierarchy(dict_name, key)",
                    "docText": "Creates an array, containing all the parents of a key in the hierarchical " +
                      "dictionary.\n" +
                      "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tkey — Key value. Expression returning a UInt64-type value.\n" +
                      "\tReturned value: Array(UInt64)\n" +
                      "\tParents for the key."
                },
                {
                    "name": "dictIsIn",
                    "def": "dictIsIn(dict_name, child_id_expr, ancestor_id_expr)",
                    "docText": "Checks the ancestor of a key through the whole hierarchical chain in the " +
                      "dictionary.\n" +
                      "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tchild_id_expr — Key to be checked. Expression returning a UInt64-type value.\n" +
                      "\tancestor_id_expr — Alleged ancestor of the child_id_expr key. Expression returning a U" +
                      "Int64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt8",
                    "def": "dictGetInt8(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt8OrDefault",
                    "def": "dictGetInt8OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt16",
                    "def": "dictGetInt16(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt16OrDefault",
                    "def": "dictGetInt16OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt32",
                    "def": "dictGetInt32(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt32OrDefault",
                    "def": "dictGetInt32OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt64",
                    "def": "dictGetInt64(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetInt64OrDefault",
                    "def": "dictGetInt64OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt8",
                    "def": "dictGetUInt8(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt8OrDefault",
                    "def": "dictGetUInt8OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt16",
                    "def": "dictGetUInt16(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt16OrDefault",
                    "def": "dictGetUInt16OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt32",
                    "def": "dictGetUInt32(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt32OrDefault",
                    "def": "dictGetUInt32OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt64",
                    "def": "dictGetUInt64(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUInt64OrDefault",
                    "def": "dictGetUInt64OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetFloat32",
                    "def": "dictGetFloat32(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetFloat32OrDefault",
                    "def": "dictGetFloat32OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetFloat64",
                    "def": "dictGetFloat64(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetFloat64OrDefault",
                    "def": "dictGetFloat64OrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetDate",
                    "def": "dictGetDate(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetDateOrDefault",
                    "def": "dictGetDateOrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetDateTime",
                    "def": "dictGetDateTime(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetDateTimeOrDefault",
                    "def": "dictGetDateTimeOrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUUID",
                    "def": "dictGetUUID(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetUUIDOrDefault",
                    "def": "dictGetUUIDOrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetString",
                    "def": "dictGetString(dict_name, attr_name, id_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                },
                {
                    "name": "dictGetStringOrDefault",
                    "def": "dictGetStringOrDefault(dict_name, attr_name, id_expr, default_value_expr)",
                    "docText": "Parameters:\n" +
                      "\tdict_name — Name of the dictionary. String literal.\n" +
                      "\tattr_name — Name of the column of the dictionary. String literal.\n" +
                      "\tid_expr — Key value. Expression returning a UInt64-type value.\n" +
                      "\tdefault_value_expr — Value which is returned if the dictionary doesn’t contain a row with " +
                      "the id_expr key. Expression returning a value in the data type configured for the attr_name " +
                      "attribute.\n" +
                      "Returned value: UInt8\n" +
                      "\t0, if child_id_expr is not a child of ancestor_id_expr.\n" +
                      "\t1, if child_id_expr is a child of ancestor_id_expr or if child_id_expr is an ancestor_id_expr."
                }
            ];
            
            var geoFunctionsCompletions = [
                {
                    "name": "greatCircleDistance",
                    "def": "greatCircleDistance(lon1Deg, lat1Deg, lon2Deg, lat2Deg)",
                    "docText": "Calculates the distance between two points on the Earth’s surface using the " +
                      "great-circle formula.\n" +
                      "Parameters:\n" +
                      "\tlon1Deg — Longitude of the first point in degrees. Range: [-180°, 180°].\n" +
                      "\tlat1Deg — Latitude of the first point in degrees. Range: [-90°, 90°].\n" +
                      "\tlon2Deg — Longitude of the second point in degrees. Range: [-180°, 180°].\n" +
                      "\tlat2Deg — Latitude of the second point in degrees. Range: [-90°, 90°].\n" +
                      "Positive values correspond to North latitude and East longitude, and negative values " +
                      "correspond to South latitude and West longitude.\n" +
                      "Returned value:\n" +
                      "The distance between two points on the Earth’s surface, in meters.\n" +
                      "Generates an exception when the input parameter values fall outside of the range."
                },
                {
                    "name": "greatCircleAngle",
                    "def": "greatCircleAngle(lon1Deg, lat1Deg, lon2Deg, lat2Deg)",
                    "docText": "Calculates the central angle between two points on the Earth’s surface using the " +
                      "great-circle formula.\n" +
                      "Parameters:\n" +
                      "\tlon1Deg — Longitude of the first point in degrees. Range: [-180°, 180°].\n" +
                      "\tlat1Deg — Latitude of the first point in degrees. Range: [-90°, 90°].\n" +
                      "\tlon2Deg — Longitude of the second point in degrees. Range: [-180°, 180°].\n" +
                      "\tlat2Deg — Latitude of the second point in degrees. Range: [-90°, 90°].\n" +
                      "Returned value:\n" +
                      "The central angle between two points in degrees."
                },
                {
                    "name": "pointInEllipses",
                    "def": "pointInEllipses(x, y, x₀, y₀, a₀, b₀,...,xₙ, yₙ, aₙ, bₙ)",
                    "docText": "Checks whether the point belongs to at least one of the ellipses.\n" +
                      "Coordinates are geometric in the Cartesian coordinate system.\n" +
                      "Parameters:\n" +
                      "\tx, y — Coordinates of a point on the plane.\n" +
                      "\txᵢ, yᵢ — Coordinates of the center of the i-th ellipsis.\n" +
                      "\taᵢ, bᵢ — Axes of the i-th ellipsis in units of x, y coordinates.\n" +
                      "The input parameters must be 2+4⋅n, where n is the number of ellipses.\n" +
                      "Returned values:\n" +
                      "1 if the point is inside at least one of the ellipses; 0if it is not."
                },
                {
                    "name": "pointInPolygon",
                    "def": "pointInPolygon((x, y), [(a, b), (c, d) ...], ...)",
                    "docText": "Checks whether the point belongs to the polygon on the plane.\n" +
                      "Parameters:\n" +
                      "\t(x, y) — Coordinates of a point on the plane. Data type — Tuple — A tuple of two numbers.\n" +
                      "\t[(a, b), (c, d) ...] — Polygon vertices. Data type — Array.\n" +
                      "Each vertex is represented by a pair of coordinates (a, b).\n" +
                      "Vertices should be specified in a clockwise or counterclockwise order.\n" +
                      "The minimum number of vertices is 3. The polygon must be constant.\n" +
                      "The function also supports polygons with holes (cut out sections).\n" +
                      "In this case, add polygons that define the cut out sections using additional arguments " +
                      "of the function.\n" +
                      "The function does not support non-simply-connected polygons.\n" +
                      "Returned values:\n" +
                      "\t1 if the point is inside the polygon, 0 if it is not.\n" +
                      "If the point is on the polygon boundary, the function may return either 0 or 1."
                },
                {
                    "name": "geohashEncode",
                    "def": "geohashEncode(longitude, latitude, [precision])",
                    "docText": "Encodes latitude and longitude as a geohash-string.\n" +
                      "Parameters:\n" +
                      "\tlongitude - longitude part of the coordinate you want to encode. " +
                      "Floating in range[-180°, 180°]\n" +
                      "\tlatitude - latitude part of the coordinate you want to encode. Floating in range [-90°, 90°]\n" +
                      "\tprecision - Optional, length of the resulting encoded string, defaults to 12.\n" +
                      "Integer in range [1, 12]. Any value less than 1 or greater than 12 is silently " +
                      "converted to 12.\n" +
                      "Returned values:\n" +
                      "\talphanumeric String of encoded coordinate (modified version of the base32-encoding " +
                      "alphabet is used).(x, y) — Coordinates of a point on the plane. " +
                      "Data type — Tuple — A tuple of two numbers."
                },
                {
                    "name": "geohashDecode",
                    "def": "geohashDecode(str)",
                    "docText": "Decodes any geohash-encoded string into longitude and latitude."
                },
                {
                    "name": "geohashesInBox",
                    "def": "geohashesInBox(longitude_min, latitude_min, longitude_max, latitude_max, precision)",
                    "docText": "Returns an array of geohash-encoded strings of given precision that fall inside and " +
                      "intersect boundaries of given box, basically a 2D grid flattened into array.\n" +
                      "Parameters:\n" +
                      "\tlongitude_min — Minimum longitude. Range: [-180°, 180°]. Type: Float.\n" +
                      "\tlatitude_min — Minimum latitude. Range: [-90°, 90°]. Type: Float.\n" +
                      "\tlongitude_max — Maximum longitude. Range: [-180°, 180°]. Type: Float.\n" +
                      "\tlatitude_max — Maximum latitude. Range: [-90°, 90°]. Type: Float.\n" +
                      "\tprecision — Geohash precision. Range: [1, 12]. Type: UInt8.\n" +
                      "Returned values: Array(String)\n" +
                      "\tArray of precision-long strings of geohash-boxes covering provided area, " +
                      "you should not rely on order of items.\n" +
                      "\t[] - Empty array if minimum latitude and longitude values aren’t less than " +
                      "corresponding maximum values."
                }
            ];
            
            var nullFunctionsCompletions = [
                {
                    "name": "isNull",
                    "def": "isNull(x)",
                    "docText": "Checks whether the argument is NULL."
                },
                {
                    "name": "isNotNull",
                    "def": "isNotNull(x)",
                    "docText": "Checks whether the argument is not NULL."
                },
                {
                    "name": "coalesce",
                    "def": "coalesce(x, ...)",
                    "docText": "Checks from left to right whether NULL arguments were passed and returns " +
                      "the first non-NULL argument."
                },
                {
                    "name": "ifNull",
                    "def": "ifNull(x, alt)",
                    "docText": "Returns an alternative value if the main argument is NULL."
                },
                {
                    "name": "nullIf",
                    "def": "nullIf(x, y)",
                    "docText": "Returns NULL if the arguments are equal."
                },
                {
                    "name": "assumeNotNull",
                    "def": "assumeNotNull(x)",
                    "docText": "Results in a value of type Nullable for a non- Nullable, if the value is not NULL."
                },
                {
                    "name": "toNullable",
                    "def": "toNullable(x)",
                    "docText": "Converts the argument type to Nullable."
                }
            ];
            
            var introspectionFunctionsCompletions = [
                {
                    "name": "addressToLine",
                    "def": "addressToLine(address_of_binary_instruction)",
                    "docText": "Converts virtual memory address inside ClickHouse server process to the filename " +
                      "and the line number in ClickHouse source code."
                },
                {
                    "name": "addressToSymbol",
                    "def": "addressToSymbol(address_of_binary_instruction)",
                    "docText": "Converts virtual memory address inside ClickHouse server process to the symbol from " +
                      "ClickHouse object files."
                },
                {
                    "name": "demangle",
                    "def": "demangle(symbol)",
                    "docText": "Converts a symbol that you can get using the addressToSymbol function " +
                      "to the C++ function name."
                }
            ];
            
            var variousFunctionsCompletions = [
                {
                    "name": "hostName",
                    "def": "hostName()",
                    "docText": "Returns a string with the name of the host that this function was performed on.\n" +
                      "For distributed processing, this is the name of the remote server host, if the function is " +
                      "performed on a remote server."
                },
                {
                    "name": "getMacro",
                    "def": "getMacro(name)",
                    "docText": "Gets a named value from the macros section of the server configuration."
                },
                {
                    "name": "FQDN",
                    "def": "FQDN()",
                    "docText": "Returns the fully qualified domain name."
                },
                {
                    "name": "fqdn",
                    "def": "fqdn()",
                    "docText": "Returns the fully qualified domain name."
                },
                {
                    "name": "basename",
                    "def": "basename(expr)",
                    "docText": "Extracts the trailing part of a string after the last slash or backslash.\n" +
                      "This function if often used to extract the filename from a path.\n" +
                      "expr — Expression resulting in a String type value. All the backslashes must be escaped " +
                      "in the resulting value."
                },
                {
                    "name": "visibleWidth",
                    "def": "visibleWidth(x)",
                    "docText": "Calculates the approximate width when outputting values to the console in text " +
                      "format (tab-separated).\n" +
                      "This function is used by the system for implementing Pretty formats.\n" +
                      "NULL is represented as a string corresponding to NULL in Pretty formats."
                },
                {
                    "name": "toTypeName",
                    "def": "toTypeName(x)",
                    "docText": "Returns a string containing the type name of the passed argument.\n" +
                      "If NULL is passed to the function as input, then it returns the Nullable(Nothing) type, " +
                      "which corresponds to an internal NULL representation in ClickHouse."
                },
                {
                    "name": "blockSize",
                    "def": "blockSize()",
                    "docText": "Gets the size of the block.\n" +
                      "In ClickHouse, queries are always run on blocks (sets of column parts).\n" +
                      "This function allows getting the size of the block that you called it for."
                },
                {
                    "name": "materialize",
                    "def": "materialize(x)",
                    "docText": "Turns a constant into a full column containing just one value.\n" +
                      "In ClickHouse, full columns and constants are represented differently in memory.\n" +
                      "Functions work differently for constant arguments and normal arguments " +
                      "(different code is executed), although the result is almost always the same.\n" +
                      "This function is for debugging this behavior."
                },
                {
                    "name": "ignore",
                    "def": "ignore(...)",
                    "docText": "Accepts any arguments, including NULL. Always returns 0.\n" +
                      "However, the argument is still evaluated. This can be used for benchmarks."
                },
                {
                    "name": "sleep",
                    "def": "sleep(seconds)",
                    "docText": "Sleeps ‘seconds’ seconds on each data block. You can specify an integer or a " +
                      "floating-point number."
                },
                {
                    "name": "sleepEachRow",
                    "def": "sleepEachRow(seconds)",
                    "docText": "Sleeps ‘seconds’ seconds on each row. You can specify an integer or a " +
                      "floating-point number."
                },
                {
                    "name": "currentDatabase",
                    "def": "currentDatabase()",
                    "docText": "Returns the login of current user. Login of user, that initiated query, " +
                      "will be returned in case distributed query."
                },
                {
                    "name": "isConstant",
                    "def": "isConstant(x)",
                    "docText": "Checks whether the argument is a constant expression.\n" +
                      "A constant expression means an expression whose resulting value is " +
                      "known at the query analysis (i.e. before execution).\n" +
                      "For example, expressions over literals are constant expressions.\n" +
                      "The function is intended for development, debugging and demonstration."
                },
                {
                    "name": "isFinite",
                    "def": "isFinite(x)",
                    "docText": "Accepts Float32 and Float64 and returns UInt8 equal to 1 if the argument is " +
                      "not infinite and not a NaN, otherwise 0."
                },
                {
                    "name": "isInfinite",
                    "def": "isInfinite(x)",
                    "docText": "Accepts Float32 and Float64 and returns UInt8 equal to 1 if the argument is " +
                      "infinite, otherwise 0. Note that 0 is returned for a NaN."
                },
                {
                    "name": "ifNotFinite",
                    "def": "ifNotFinite(checkValue, fallbackValue)",
                    "docText": "Checks whether floating point value is finite."
                },
                {
                    "name": "isNaN",
                    "def": "isNaN(x)",
                    "docText": "Accepts Float32 and Float64 and returns UInt8 equal to 1 if the argument is a NaN, otherwise 0."
                },
                {
                    "name": "hasColumnInTable",
                    "def": "hasColumnInTable([hostname[, username[, password]],] database, table, column)",
                    "docText": "Accepts constant strings: database name, table name, and column name.\n" +
                      "Returns a UInt8 constant expression equal to 1 if there is a column, otherwise 0.\n" +
                      "If the hostname parameter is set, the test will run on a remote server.\n" +
                      "The function throws an exception if the table does not exist.\n" +
                      "For elements in a nested data structure, the function checks for the existence of a column.\n" +
                      "For the nested data structure itself, the function returns 0."
                },
                {
                    "name": "bar",
                    "def": "bar(x, min, max, width)",
                    "docText": "Allows building a unicode-art diagram."
                },
                {
                    "name": "transform",
                    "def": "transform(x, array_from, array_to[, default])",
                    "docText": "Transforms a value according to the explicitly defined mapping of some elements to other ones.\n" +
                      "\tx – What to transform.\n" +
                      "\tarray_from – Constant array of values for converting.\n" +
                      "\tarray_to – Constant array of values to convert the values in ‘from’ to.\n" +
                      "\tdefault – Optional value to use if ‘x’ is not equal to any of the values in ‘from’.\n" +
                      "array_from and array_to – Arrays of the same size."
                },
                {
                    "name": "formatReadableSize",
                    "def": "formatReadableSize(filesize_bytes)",
                    "docText": "Accepts the size (number of bytes).\n" +
                      "Returns a rounded size with a suffix (KiB, MiB, etc.) as a string."
                },
                {
                    "name": "least",
                    "def": "least(a, b)",
                    "docText": "Returns the smallest value from a and b."
                },
                {
                    "name": "greatest",
                    "def": "greatest(a, b)",
                    "docText": "Returns the largest value from a and b."
                },
                {
                    "name": "uptime",
                    "def": "uptime()",
                    "docText": "Returns the server’s uptime in seconds."
                },
                {
                    "name": "version",
                    "def": "version()",
                    "docText": "Returns the version of the server as a string."
                },
                {
                    "name": "timezone",
                    "def": "timezone()",
                    "docText": "Returns the timezone of the server."
                },
                {
                    "name": "blockNumber",
                    "def": "blockNumber()",
                    "docText": "Returns the sequence number of the data block where the row is located."
                },
                {
                    "name": "rowNumberInBlock",
                    "def": "rowNumberInBlock()",
                    "docText": "Returns the ordinal number of the row in the data block.\n" +
                      "Different data blocks are always recalculated."
                },
                {
                    "name": "rowNumberInAllBlocks",
                    "def": "rowNumberInAllBlocks()",
                    "docText": "Returns the ordinal number of the row in the data block.\n" +
                      "This function only considers the affected data blocks."
                },
                {
                    "name": "neighbor",
                    "def": "neighbor(column, offset[, default_value])",
                    "docText": "The window function that provides access to a row at a specified offset which comes " +
                      "before or after the current row of a given column.\n" +
                      "The result of the function depends on the affected data blocks and the order of data in the " +
                      "block.\n" +
                      "If you make a subquery with ORDER BY and call the function from outside the subquery, " +
                      "you can get the expected result.\n" +
                      "Parameters:\n" +
                      "\tcolumn — A column name or scalar expression.\n" +
                      "\toffset — The number of rows forwards or backwards from the current row of column. Int64.\n" +
                      "\tdefault_value — Optional. The value to be returned if offset goes beyond the scope " +
                      "of the block. Type of data blocks affected.\n" +
                      "Returned values:\n" +
                      "\tValue for column in offset distance from current row if offset value is not outside " +
                      "block bounds.\n" +
                      "\tDefault value for column if offset value is outside block bounds. If default_value is " +
                      "given, then it will be used.\n" +
                      "Type: type of data blocks affected or default value type."
                },
                {
                    "name": "runningDifference",
                    "def": "runningDifference(x)",
                    "docText": "Calculates the difference between successive row values ​​in the data block.\n" +
                      "Returns 0 for the first row and the difference from the previous row for each subsequent row.\n" +
                      "The result of the function depends on the affected data blocks and the order of data " +
                      "in the block.\n" +
                      "If you make a subquery with ORDER BY and call the function from outside the subquery, " +
                      "you can get the expected result."
                },
                {
                    "name": "runningDifferenceStartingWithFirstValue",
                    "def": "runningDifferenceStartingWithFirstValue(x)",
                    "docText": "Same as for runningDifference, the difference is the value of the first row, " +
                      "returned the value of the first row, and each subsequent row returns the difference " +
                      "from the previous row."
                },
                {
                    "name": "MACNumToString",
                    "def": "MACNumToString(num)",
                    "docText": "Accepts a UInt64 number. Interprets it as a MAC address in big endian.\n" +
                      "Returns a string containing the corresponding MAC address in the format AA:BB:CC:DD:EE:FF " +
                      "(colon-separated numbers in hexadecimal form)."
                },
                {
                    "name": "MACStringToNum",
                    "def": "MACStringToNum(s)",
                    "docText": "The inverse function of MACNumToString.\n" +
                      "If the MAC address has an invalid format, it returns 0."
                },
                {
                    "name": "MACStringToOUI",
                    "def": "MACStringToOUI(s)",
                    "docText": "Accepts a MAC address in the format AA:BB:CC:DD:EE:FF " +
                      "(colon-separated numbers in hexadecimal form).\n" +
                      "Returns the first three octets as a UInt64 number.\n" +
                      "If the MAC address has an invalid format, it returns 0."
                },
                {
                    "name": "getSizeOfEnumType",
                    "def": "getSizeOfEnumType(value)",
                    "docText": "Returns the number of fields in Enum."
                },
                {
                    "name": "blockSerializedSize",
                    "def": "blockSerializedSize(value[, value[, ...]])",
                    "docText": "Returns size on disk (without taking into account compression)."
                },
                {
                    "name": "toColumnTypeName",
                    "def": "toColumnTypeName(value)",
                    "docText": "Returns the name of the class that represents the data type of the column in RAM."
                },
                {
                    "name": "dumpColumnStructure",
                    "def": "dumpColumnStructure(value)",
                    "docText": "Outputs a detailed description of data structures in RAM"
                },
                {
                    "name": "defaultValueOfArgumentType",
                    "def": "defaultValueOfArgumentType(expression)",
                    "docText": "Outputs the default value for the data type.\n" +
                      "Does not include default values for custom columns set by the user."
                },
                {
                    "name": "replicate",
                    "def": "replicate(x, arr)",
                    "docText": "Creates an array with a single value."
                },
                {
                    "name": "filesystemAvailable",
                    "def": "filesystemAvailable()",
                    "docText": "Returns amount of remaining space on the filesystem where the files " +
                      "of the databases located.\n" +
                      "It is always smaller than total free space (filesystemFree) because some space " +
                      "is reserved for OS."
                },
                {
                    "name": "filesystemFree",
                    "def": "filesystemFree()",
                    "docText": "Returns total amount of the free space on the filesystem where the files of " +
                      "the databases located."
                },
                {
                    "name": "filesystemCapacity",
                    "def": "filesystemCapacity()",
                    "docText": "Returns the capacity of the filesystem in bytes.\n" +
                      "For evaluation, the path to the data directory must be configured."
                },
                {
                    "name": "finalizeAggregation",
                    "def": "filesystemCapacity()",
                    "docText": "Takes state of aggregate function.\n" +
                      "Returns result of aggregation (finalized state)."
                },
                {
                    "name": "runningAccumulate",
                    "def": "runningAccumulate(agg_state[, grouping])",
                    "docText": "Accumulates states of an aggregate function for each row of a data block."
                },
                {
                    "name": "joinGet",
                    "def": "joinGet(join_storage_table_name, value_column, join_keys)",
                    "docText": "The function lets you extract data from the table the same way as from " +
                      "a dictionary.\n" +
                      "Gets data from Join tables using the specified join key.\n" +
                      "Only supports tables created with the ENGINE = Join(ANY, LEFT, <join_keys>) statement.\n" +
                      "Parameters:\n" +
                      "\tjoin_storage_table_name — an identifier indicates where search is performed.\n" +
                      "\t\tThe identifier is searched in the default database " +
                      "(see parameter default_database in the config file).\n" +
                      "\t\tTo override the default database, use the USE db_name or specify the database and the " +
                      "table through the separator db_name.db_table, see the example.\n" +
                      "\tvalue_column — name of the column of the table that contains required data.\n" +
                      "\tjoin_keys — list of keys."
                },
                {
                    "name": "modelEvaluate",
                    "def": "modelEvaluate(model_name, …)",
                    "docText": "Evaluate external model.\n" +
                      "Accepts a model name and model arguments. Returns Float64."
                },
                {
                    "name": "throwIf",
                    "def": "throwIf(x[, custom_message])",
                    "docText": "Evaluate external model.\n" +
                      "Accepts a model name and model arguments. Returns Float64."
                },
                {
                    "name": "identity",
                    "def": "identity(x)",
                    "docText": "Returns the same value that was used as its argument.\n" +
                      "Used for debugging and testing, allows to cancel using index, " +
                      "and get the query performance of a full scan. When query is analyzed for possible " +
                      "use of index, the analyzer doesn’t look inside identity functions."
                },
                {
                    "name": "randomPrintableASCII",
                    "def": "randomPrintableASCII(length)",
                    "docText": "Generates a string with a random set of ASCII printable characters."
                },
                {
                    "name": "randomString",
                    "def": "randomString(length)",
                    "docText": "Generates a binary string of the specified length filled with random bytes " +
                      "(including zero bytes)."
                },
                {
                    "name": "randomFixedString",
                    "def": "randomFixedString(length)",
                    "docText": "Generates a binary string of the specified length filled with random bytes " +
                      "(including zero bytes)."
                },
                {
                    "name": "randomStringUTF8",
                    "def": "randomStringUTF8(length)",
                    "docText": "Generates a random string of a specified length.\n" +
                      "Result string contains valid UTF-8 code points.\n" +
                      "The value of code points may be outside of the range of assigned Unicode."
                }
            ];
            
            var aggregateFunctionsCompletions = [
                {
                    "name": "histogram",
                    "def": "histogram(number_of_bins)(values)",
                    "docText": "Calculates an adaptive histogram. It doesn’t guarantee precise results."
                },
                {
                    "name": "sequenceMatch",
                    "def": "sequenceMatch(pattern)(timestamp, cond1, cond2, …)",
                    "docText": "Checks whether the sequence contains an event chain that matches the pattern.\n" +
                      "Parameters:\n" +
                      "\tpattern — Pattern string. See Pattern syntax.\n" +
                      "\ttimestamp — Column considered to contain time data. Typical data types are Date and DateTime. You can also use any of the supported UInt data types.\n" +
                      "\tcond1, cond2 — Conditions that describe the chain of events. Data type: UInt8. You can pass up to 32 condition arguments. The function takes only the events described in these conditions into account. If the sequence contains data that isn’t described in a condition, the function skips them.\n" +
                      "Returned values:\n" +
                      "\t1, if the pattern is matched.\n" +
                      "\t0, if the pattern isn’t matched.\n" +
                      "Type: UInt8."
                },
                {
                    "name": "sequenceCount",
                    "def": "sequenceCount(pattern)(time, cond1, cond2, …)",
                    "docText": "Counts the number of event chains that matched the pattern.\n" +
                      "The function searches event chains that don’t overlap.\n" +
                      "It starts to search for the next chain after the current chain is matched.\n" +
                      "Parameters:\n" +
                      "\tpattern — Pattern string. See Pattern syntax.\n" +
                      "\ttimestamp — Column considered to contain time data. \n" +
                      "\t\tTypical data types are Date and DateTime.\n" +
                      "\t\tYou can also use any of the supported UInt data types.\n" +
                      "\tcond1, cond2 — Conditions that describe the chain of events.\n" +
                      "\t\tData type: UInt8. You can pass up to 32 condition arguments.\n" +
                      "\t\tThe function takes only the events described in these conditions into account.\n" +
                      "\t\tIf the sequence contains data that isn’t described in a condition, " +
                      "the function skips them.\n" +
                      "Returned values:\n" +
                      "\tNumber of non-overlapping event chains that are matched.\n" +
                      "Type: UInt64."
                },
                {
                    "name": "windowFunnel",
                    "def": "windowFunnel(window, [mode])(timestamp, cond1, cond2, ..., condN)",
                    "docText": "Searches for event chains in a sliding time window and calculates the maximum " +
                      "number of events that occurred from the chain.\n" +
                      "Parameters\n" +
                      "\twindow — Length of the sliding window in seconds.\n" +
                      "\tmode - It is an optional argument.\n" +
                      "\t\t'strict' - When the 'strict' is set, the windowFunnel() applies conditions only for the " +
                      "unique values.\n" +
                      "\ttimestamp — Name of the column containing the timestamp. Data types supported: " +
                      "Date, DateTime and other unsigned integer types (note that even though timestamp supports " +
                      "the UInt64 type, it’s value can’t exceed the Int64 maximum, which is 2^63 - 1).\n" +
                      "\tcond — Conditions or data describing the chain of events. UInt8.\n" +
                      "Returned value\n" +
                      "\tThe maximum number of consecutive triggered conditions from the chain within the sliding " +
                      "time window.\n" +
                      "\tAll the chains in the selection are analyzed.\n" +
                      "Type: Integer."
                },
                {
                    "name": "retention",
                    "def": "retention(cond1, cond2, ..., cond32)",
                    "docText": "The function takes as arguments a set of conditions from 1 to 32 arguments of " +
                      "type UInt8 that indicate whether a certain condition was met for the event.\n" +
                      "Any condition can be specified as an argument (as in WHERE).\n" +
                      "The conditions, except the first, apply in pairs: the result of the second will be true " +
                      "if the first and second are true, of the third if the first and third are true, etc.\n" +
                      "Parameters:\n" +
                      "\tcond — an expression that returns a UInt8 result (1 or 0).\n" +
                      "Returned value:\n" +
                      "\tThe array of 1 or 0.\n" +
                      "\t\t1 — condition was met for the event.\n" +
                      "\t\t0 — condition wasn’t met for the event.\n" +
                      "Type: UInt8."
                },
                {
                    "name": "uniqUpTo",
                    "def": "uniqUpTo(N)(x)",
                    "docText": "Calculates the number of different argument values ​​if it is less than or " +
                      "equal to N. If the number of different argument values is greater than N, it returns N + 1.\n" +
                      "Recommended for use with small Ns, up to 10. The maximum value of N is 100.\n" +
                      "For the state of an aggregate function, it uses the amount of memory equal to 1 + N * the " +
                      "size of one value of bytes.\n" +
                      "For strings, it stores a non-cryptographic hash of 8 bytes. That is, the calculation is " +
                      "approximated for strings.\n" +
                      "The function also works for several arguments.\n" +
                      "It works as fast as possible, except for cases when a large N value is used and the number " +
                      "of unique values is slightly less than N."
                },
                {
                    "name": "sumMapFiltered",
                    "def": "sumMapFiltered(keys_to_keep)(keys, values)",
                    "docText": "Same behavior as sumMap except that an array of keys is passed as a parameter.\n" +
                      "This can be especially useful when working with a high cardinality of keys."
                }
            ];
            
            var tableFunctionsCompletions = [
                {
                    "name": "file",
                    "def": "file(path, format, structure)",
                    "docText": "Creates a table from a file. This table function is similar to url and hdfs ones.\n" +
                      "Input parameters:\n" +
                      "\tpath — The relative path to the file from user_files_path. Path to file support following " +
                      "globs in readonly mode: *, ?, {abc,def} and {N..M} where N, M — numbers, " +
                      "`'abc', 'def' — strings.\n" +
                      "\tformat — The format of the file.\n" +
                      "\tstructure — Structure of the table. " +
                      "Format 'column1_name column1_type, column2_name column2_type, ...'.\n" +
                      "Returned value:\n" +
                      "\tA table with the specified structure for reading or writing data in the specified file."
                },
                {
                    "name": "merge",
                    "def": "merge(db_name, 'tables_regexp')",
                    "docText": "Creates a temporary Merge table.\n" +
                      "The table structure is taken from the first " +
                      "table encountered that matches the regular expression."
                },
                {
                    "name": "numbers",
                    "def": "numbers(N[, M])",
                    "docText": "numbers(N) – Returns a table with the single ‘number’ column (UInt64) that contains " +
                      "integers from 0 to N-1.\n" +
                      "numbers(N, M) - Returns a table with the single ‘number’ column (UInt64) that contains " +
                      "integers from N to (N + M - 1).\n" +
                      "\n" +
                      "Similar to the system.numbers table, it can be used for testing and generating successive " +
                      "values, numbers(N, M) more efficient than system.numbers."
                },
                {
                    "name": "remote",
                    "def": "remote('addresses_expr', db, table[, 'user'[, 'password']]) ; " +
                      "remote('addresses_expr', db.table[, 'user'[, 'password']])",
                    "docText": "Allows you to access remote servers without creating a Distributed table.\n" +
                      "addresses_expr – An expression that generates addresses of remote servers.\n" +
                      "This may be just one server address. The server address is host:port, or just host.\n" +
                      "The host can be specified as the server name, or as the IPv4 or IPv6 address.\n" +
                      "An IPv6 address is specified in square brackets.\n" +
                      "The port is the TCP port on the remote server.\n" +
                      "If the port is omitted, it uses tcp_port from the server’s config file (by default, 9000)."
                },
                {
                    "name": "remoteSecure",
                    "def": "remoteSecure('addresses_expr', db, table[, 'user'[, 'password']]) ; " +
                      "remoteSecure('addresses_expr', db.table[, 'user'[, 'password']])",
                    "docText": "Allows you to access remote servers without creating a Distributed table.\n" +
                      "addresses_expr – An expression that generates addresses of remote servers.\n" +
                      "This may be just one server address. The server address is host:port, or just host.\n" +
                      "The host can be specified as the server name, or as the IPv4 or IPv6 address.\n" +
                      "An IPv6 address is specified in square brackets.\n" +
                      "The port is the TCP port on the remote server.\n" +
                      "If the port is omitted, it uses tcp_port from the server’s config file (by default, 9000)."
                },
                {
                    "name": "url",
                    "def": "url(URL, format, structure)",
                    "docText": "returns a table created from the URL with given format and structure.\n" +
                      "\tURL - HTTP or HTTPS server address, which can accept GET and/or POST requests.\n" +
                      "\tformat - format of the data.\n" +
                      "\tstructure - table structure in 'UserID UInt64, Name String' format.\n" +
                      "Determines column names and types."
                },
                {
                    "name": "mysql",
                    "def": "mysql(host:port, database, table, user, password[, replace_query, on_duplicate_clause])",
                    "docText": "Allows SELECT queries to be performed on data that is stored on a remote " +
                      "MySQL server.\n" +
                      "Parameters:\n" +
                      "\thost:port — MySQL server address.\n" +
                      "\tdatabase — Remote database name.\n" +
                      "\ttable — Remote table name.\n" +
                      "\tuser — MySQL user.\n" +
                      "\tpassword — User password.\n" +
                      "\treplace_query — Flag that converts INSERT INTO queries to REPLACE INTO. " +
                      "If replace_query=1, the query is replaced.\n" +
                      "\ton_duplicate_clause — The ON DUPLICATE KEY on_duplicate_clause expression that is added to " +
                      "the INSERT query.\n" +
                      "Returned Value:\n" +
                      "A table object with the same columns as the original MySQL table."
                },
                {
                    "name": "jdbc",
                    "def": "jdbc(jdbc_connection_uri, schema, table)",
                    "docText": "Returns table that is connected via JDBC driver.\n" +
                      "This table function requires separate clickhouse-jdbc-bridge program to be running.\n" +
                      "It supports Nullable types (based on DDL of remote table that is queried)."
                },
                {
                    "name": "hdfs",
                    "def": "hdfs(URI, format, structure)",
                    "docText": "Creates a table from files in HDFS. This table function is similar to url and file " +
                      "ones.\n" +
                      "Input parameters:\n" +
                      "\tURI — The relative URI to the file in HDFS. Path to file support following globs in " +
                      "readonly mode: *, ?, {abc,def} and {N..M} where N, M — numbers, `'abc', 'def' — strings.\n" +
                      "\tformat — The format of the file.\n" +
                      "\tstructure — Structure of the table. Format 'column1_name column1_type, column2_name " +
                      "column2_type, ...'.\n" +
                      "Returned value:\n" +
                      "\tA table with the specified structure for reading or writing data in the specified file."
                },
                {
                    "name": "input",
                    "def": "input(structure)",
                    "docText": "table function that allows effectively convert and insert data sent to the\n" +
                      "server with given structure to the table with another structure.\n" +
                      "\n" +
                      "structure - structure of data sent to the server in following format " +
                      "'column1_name column1_type, column2_name column2_type, ...'.\n" +
                      "For example, 'id UInt32, name String'.\n" +
                      "\n" +
                      "This function can be used only in INSERT SELECT query and only once but otherwise behaves l" +
                      "ike ordinary table function\n" +
                      "(for example, it can be used in subquery, etc.).\n" +
                      "\n" +
                      "Data can be sent in any way like for ordinary INSERT query and passed in any available format\n" +
                      "that must be specified in the end of query (unlike ordinary INSERT SELECT).\n" +
                      "\n" +
                      "The main feature of this function is that when server receives data from client it " +
                      "simultaneously converts it\n" +
                      "according to the list of expressions in the SELECT clause and inserts into the target table. " +
                      "Temporary table\n" +
                      "with all transferred data is not created."
                },
                {
                    "name": "generateRandom",
                    "def": "generateRandom(name TypeName[, name TypeName]..., " +
                      "[, random_seed[, max_string_length[, max_array_length]]])",
                    "docText": "Generates random data with given schema.\n" +
                      "Allows to populate test tables with data.\n" +
                      "Supports all data types that can be stored in table except " +
                      "LowCardinality and AggregateFunction.\n" +
                      "Parameters:\n" +
                      "\tname — Name of corresponding column.\n" +
                      "\tTypeName — Type of corresponding column.\n" +
                      "\tmax_array_length — Maximum array length for all generated arrays. Defaults to 10.\n" +
                      "\tmax_string_length — Maximum string length for all generated strings. Defaults to 10.\n" +
                      "\trandom_seed — Specify random seed manually to produce stable results. " +
                      "If NULL — seed is randomly generated.\n" +
                      "Returned Value:\n" +
                      "\tA table object with requested schema."
                },
                {
                    "name": "cluster",
                    "def": "cluster(cluster_name, db.table) ; cluster(cluster_name, db, table)",
                    "docText": "Allows to access all shards in an existing cluster which configured in " +
                      "remote_servers section without creating a Distributed table.\n" +
                      "One replica of each shard is queried.\n" +
                      "clusterAllReplicas - same as cluster but all replicas are queried.\n" +
                      "Each replica in a cluster is used as separate shard/connection.\n" +
                      "\tcluster_name – Name of a cluster that is used to build a set of addresses and connection" +
                      "parameters to remote and local servers."
                },
                {
                    "name": "clusterAllReplicas",
                    "def": "clusterAllReplicas(cluster_name, db.table) ; " +
                      "clclusterAllReplicasuster(cluster_name, db, table)",
                    "docText": "Allows to access all shards in an existing cluster which configured in " +
                      "remote_servers section without creating a Distributed table.\n" +
                      "One replica of each shard is queried.\n" +
                      "clusterAllReplicas - same as cluster but all replicas are queried.\n" +
                      "Each replica in a cluster is used as separate shard/connection.\n" +
                      "\tcluster_name – Name of a cluster that is used to build a set of addresses and connection" +
                      "parameters to remote and local servers."
                }
            ];
            
            var functionsCompletions = arithmeticFunctionsCompletions
              .concat(comparisonFunctionsCompletions)
              .concat(logicalFunctionsCompletions)
              .concat(typeConversionFunctionsCompletions)
              .concat(timeFunctionsCompletions)
              .concat(stringFunctionsCompletions)
              .concat(stringsSearchingFunctionsCompletions)
              .concat(stringsReplacingFunctionsCompletions)
              .concat(conditionalFunctionsCompletions)
              .concat(mathFunctionsCompletions)
              .concat(roundingFunctionsCompletions)
              .concat(arraysFunctionsCompletions)
              .concat(mapsFunctionsCompletions)
              .concat(splittingMergingFunctionsCompletions)
              .concat(bitFunctionsCompletions)
              .concat(bitmapFunctionsCompletions)
              .concat(hashFunctionsCompletions)
              .concat(pseudoRandomNumbersFunctionsCompletions)
              .concat(encodingFunctionsCompletions)
              .concat(uuidFunctionsCompletions)
              .concat(urlFunctionsCompletions)
              .concat(ipFunctionsCompletions)
              .concat(jsonFunctionsCompletions)
              .concat(higherOrderFunctionsCompletions)
              .concat(extDictionariesFunctionsCompletions)
              .concat(geoFunctionsCompletions)
              .concat(nullFunctionsCompletions)
              .concat(introspectionFunctionsCompletions)
              .concat(variousFunctionsCompletions)
              .concat(aggregateFunctionsCompletions)
              .concat(tableFunctionsCompletions);
            
            var functionsNames = functionsCompletions.map(c => c.name);

            var ClickhouseInfo = {};
            ClickhouseInfo.Keywords = [
                "SELECT",
                "CASE",
                "THEN",
                "DISTINCT",
                "INSERT",
                "UPDATE",
                "DELETE",
                "WHERE",
                "AND",
                "OR",
                "OFFSET",
                "HAVING",
                "AS",
                "GLOBAL",
                "FROM",
                "WHEN",
                "ELSE",
                "END",
                "TYPE",
                "LEFT",
                "RIGHT",
                "USING",
                "JOIN",
                "ON",
                "OUTER",
                "DESC",
                "ASC",
                "UNION",
                "CREATE",
                "TABLE",
                "PRIMARY",
                "KEY",
                "FOREIGN",
                "NOT",
                "REFERENCES",
                "DEFAULT",
                "INNER",
                "CROSS",
                "NATURAL",
                "DATABASE",
                "DROP",
                "GRANT",
                "ANY",
                "BETWEEN",
                "ATTACH",
                "DETACH",
                "CAST",
                "WITH",
                "BIT_AND",
                "BIT_OR",
                "BIT_XOR",
                "DESCRIBE",
                "OPTIMIZE",
                "PREWHERE",
                "TOTALS",
                "DATABASES",
                "PROCESSLIST",
                "SHOW",
                "LIMIT",
                "IF",
                "IF NOT EXISTS",
                "IF EXISTS",
                "GROUP",
                "ORDER",
                "BY",
                "IN",
                "FORMAT",
                "GROUP BY",
                "ORDER BY",
                "UNION ALL"
            ];
            ClickhouseInfo.DataTypes = [
                "int",
                "numeric",
                "decimal",
                "date",
                "varchar",
                "char",
                "bigint",
                "float",
                "double",
                "bit",
                "binary",
                "text",
                "set",
                "timestamp",
                "uint8",
                "uint16",
                "uint32",
                "uint64",
                "int8",
                "int16",
                "int32",
                "int64",
                "float32",
                "float64",
                "datetime",
                "enum8",
                "enum16",
                "array",
                "tuple",
                "string"
            ];
            ClickhouseInfo.Constants = [
                "true",
                "false",
                "NULL"
            ];
            ClickhouseInfo.Funcs = functionsNames;
            ClickhouseInfo.Macros = [];
            ClickhouseInfo.KeywordsRe = function () {
                return this.re(ClickhouseInfo.Keywords)
            };
            ClickhouseInfo.ConstantsRe = function () {
                return this.re(ClickhouseInfo.Constants)
            };
            ClickhouseInfo.FunctionsRe = function () {
                return this.re(ClickhouseInfo.Funcs).concat(this.re(ClickhouseInfo.Macros))
            };
            ClickhouseInfo.DataTypesRe = function () {
                return this.re(ClickhouseInfo.DataTypes);
            };
            ClickhouseInfo.FunctionsCompletions = function () {
                return functionsCompletions;
            };

            ClickhouseInfo.MacrosCompletions = function () {
                return [];
            };

            ClickhouseInfo.re = function (list) {
                return list.join("|")
            };

            exports.ClickhouseInfo = ClickhouseInfo;
        });

        return true;
    } else {
        return false;
    }
}
