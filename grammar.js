/**
 * @file A simple, interpreted, multithreaded programming language
 * @author Borui
 * @license MIT
 */

/// <reference types="./tree-sitter-cli/dsl/index.d.ts" />
// @ts-check
module.exports = grammar({
  name: "simpl",

  rules: {
    source_file: ($) => repeat($.statement),

    statement: ($) =>
      choice(
        $.let_declaration,
        $.fn_declaration,
        $.assign_statement,
        $.print_statement,
        $.return_statement,
        $.if_statement,
        $.fn_call,
        $.scope,
        $.while_loop,
      ),

    let_declaration: ($) => seq("let", $.identifier, "=", $.expression, ";"),

    fn_declaration: ($) =>
      seq(
        "fn",
        $.identifier,
        "(",
        repeat(seq($.typed_indentifier, ",")),
        optional($.typed_indentifier),
        ")",
        optional($.return_type),
        $.scope,
      ),

    // NOTE: rep seq exp + , is for the first few options,
    //       opt exp is for 1 or zero options
    //       rep can also be zero
    fn_call: ($) =>
      seq(
        $.identifier,
        "(",
        repeat(seq($.expression, ",")),
        optional($.expression),
        ")",
        ";",
      ),

    assign_statement: ($) => seq($.identifier, "=", $.expression, ";"),
    print_statement: ($) => seq("print", $.expression, ";"),

    return_statement: ($) => seq("return", optional($.expression), ";"),
    return_type: ($) => seq("->", $.type),

    expression: ($) =>
      choice($.number, $.boolean, $.identifier, $.operation, $.scope),

    scope: ($) => seq("{", repeat($.statement), "}"),

    if_statement: ($) => seq("if", "(", $.expression, ")", $.scope),

    while_loop: ($) => seq("while", "(", $.expression, ")", $.scope),
    operation: ($) =>
      choice(
        $.addition,
        $.subtraction,
        $.multiplication,
        $.division,
        $.less_than,
        $.less_than_or_equal_to,
        $.greater_than,
        $.greater_than_or_equal_to,
        $.equal_to,
        $.not_equal_to,
      ),

    addition: ($) => {
      return prec.left(1, seq($.expression, "+", $.expression));
    },

    subtraction: ($) => {
      return prec.left(1, seq($.expression, "-", $.expression));
    },

    multiplication: ($) => {
      return prec.left(1, seq($.expression, "*", $.expression));
    },

    division: ($) => {
      return prec.left(1, seq($.expression, "/", $.expression));
    },

    greater_than: ($) => {
      return prec.left(1, seq($.expression, ">", $.expression));
    },

    less_than: ($) => {
      return prec.left(1, seq($.expression, "<", $.expression));
    },

    greater_than_or_equal_to: ($) => {
      return prec.left(1, seq($.expression, ">=", $.expression));
    },

    less_than_or_equal_to: ($) => {
      return prec.left(1, seq($.expression, "<=", $.expression));
    },

    equal_to: ($) => {
      return prec.left(1, seq($.expression, "==", $.expression));
    },

    not_equal_to: ($) => {
      return prec.left(1, seq($.expression, "!=", $.expression));
    },

    true: () => "true",
    false: () => "false",
    boolean: ($) => choice($.true, $.false),

    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    type: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    typed_indentifier: ($) => seq($.identifier, ":", $.type),

    number: () => seq(/\d+/, optional(seq(".", /\d+/))),
    //number: () => /\d+/,
  },
});
