'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const RazorpayButton = ({ planType, planName, amount, credits, className, children, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.')
        setLoading(false)
        return
      }

      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planType }),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MyDesignBazaar',
        description: `${planName} - ${credits} Credits`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                transactionId: orderData.transactionId,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            const verifyData = await verifyResponse.json()

            // Success callback
            if (onSuccess) {
              onSuccess(verifyData)
            } else {
              alert(`Payment successful! ${verifyData.creditPoints} credits have been added to your account.`)
              window.location.reload()
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
            if (onFailure) onFailure(error)
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#f97316', // Orange color to match your theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
            if (onFailure) onFailure(new Error('Payment cancelled'))
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert(error.message || 'Failed to initiate payment. Please try again.')
      setLoading(false)
      if (onFailure) onFailure(error)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={className || 'w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processing...
        </span>
      ) : (
        children || 'Get Started'
      )}
    </button>
  )
}

export default RazorpayButton
