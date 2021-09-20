import { GraphQLError } from '../../error/GraphQLError.ts';
import { print } from '../../language/printer.ts';
import type { ASTVisitor } from '../../language/visitor.ts';
import type { VariableDefinitionNode } from '../../language/ast.ts';
import { isInputType } from '../../type/definition.ts';
import { typeFromAST } from '../../utilities/typeFromAST.ts';
import type { ValidationContext } from '../ValidationContext.ts';
/**
 * Variables are input types
 *
 * A GraphQL operation is only valid if all the variables it defines are of
 * input types (scalar, enum, or input object).
 */

export function VariablesAreInputTypesRule(
  context: ValidationContext,
): ASTVisitor {
  return {
    VariableDefinition(node: VariableDefinitionNode) {
      const type = typeFromAST(context.getSchema(), node.type);

      if (type && !isInputType(type)) {
        const variableName = node.variable.name.value;
        const typeName = print(node.type);
        context.reportError(
          new GraphQLError(
            `Variable "$${variableName}" cannot be non-input type "${typeName}".`,
            node.type,
          ),
        );
      }
    },
  };
}