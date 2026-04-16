export const useCheckout = () => {
  const placeOrder = async (data: any) => {
    return fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return { placeOrder };
};