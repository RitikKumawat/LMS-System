import { loadRazorpay } from './loadRazorpay';

export async function startRazorpayPayment({
    order,
    course,
    user,
    onDismiss,
}: {
    order: {
        razorpay_order_id: string;
        amount: number;
        currency: string;
    };
    course: { title: string };
    user: { name: string; email: string };
    onDismiss?: () => void;
}) {
    const res = await loadRazorpay();
    if (!res) {
        alert('Razorpay SDK failed to load');
        return;
    }

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // PUBLIC KEY ONLY
        amount: order.amount, // paise
        currency: order.currency,
        name: 'Nexus LMS',
        description: course.title,
        order_id: order.razorpay_order_id,

        prefill: {
            name: user.name,
            email: user.email,
        },

        theme: {
            color: '#6366f1',
        },

        handler: function () {
            // ❗ DO NOTHING HERE
            // Payment confirmation comes from webhook
        },
        modal: {
            ondismiss: function () {
                if (onDismiss) onDismiss();
            }
        }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
}