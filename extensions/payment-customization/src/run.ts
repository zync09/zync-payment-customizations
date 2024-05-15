import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  const hasAfterPayEnabled = input.paymentMethods.find(method => method.name.includes("Afterpay"))
  if(!hasAfterPayEnabled) return NO_CHANGES;

  const someProductsHaveNoAfterpay = input.cart.lines.some((line) => {
    //if line is not a product variant, return false
    if (!line.merchandise.__typename || line.merchandise.__typename !== "ProductVariant") return false;

    // Check if 'noafterpay' tag exists and is true
    if (line.merchandise.product && typeof line.merchandise.product.noafterpay !== 'undefined') {
      console.error('noafterpay tag: ',line.merchandise.product.noafterpay)
      return line.merchandise.product.noafterpay;
    }

    // Otherwise, return false
    return false;
  })

  console.error('someProductsHaveNoAfterpay: ',someProductsHaveNoAfterpay)
  if(!someProductsHaveNoAfterpay) return NO_CHANGES;

  return {
    operations: [{
      hide: {
        paymentMethodId: hasAfterPayEnabled.id
      }
    }]
  }
};

//657cf551-24b3-473d-985d-7f3d39ce4a24
