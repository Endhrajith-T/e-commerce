export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone)
}

export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode)
}

export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp)
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function validateCheckoutForm(form: {
  name: string
  phone: string
  address: string
  pincode: string
}): string | null {
  if (!isNonEmpty(form.name)) return 'Name is required'
  if (!isValidPhone(form.phone)) return 'Enter a valid 10-digit phone number'
  if (!isNonEmpty(form.address)) return 'Address is required'
  if (!isValidPincode(form.pincode)) return 'Enter a valid 6-digit pincode'
  return null
}
