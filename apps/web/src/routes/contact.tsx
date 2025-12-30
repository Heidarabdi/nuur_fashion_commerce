import { createFileRoute } from '@tanstack/react-router'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { getFieldError } from '../lib/form-utils'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: 'general',
      message: '',
    },
    validators: {
      onChange: contactSchema,
    },
    onSubmit: async () => {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Message sent!', {
        description: "We'll get back to you within 24 hours.",
      })
      setIsSubmitted(true)
    },
  })

  return (
    <div className="min-h-screen pt-10">
      <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-foreground/70 text-lg">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Message Sent!</h2>
                  <p className="text-foreground/60">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      form.reset()
                    }}
                    className="mt-6 text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                  className="bg-card rounded-2xl border border-border p-8 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.Field name="firstName">
                      {(field) => (
                        <div>
                          <label className="block text-sm font-medium mb-2">First Name *</label>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                              }`}
                            placeholder="John"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errors)}</p>
                          )}
                        </div>
                      )}
                    </form.Field>
                    <form.Field name="lastName">
                      {(field) => (
                        <div>
                          <label className="block text-sm font-medium mb-2">Last Name *</label>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                              }`}
                            placeholder="Doe"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errors)}</p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Field name="email">
                    {(field) => (
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className={`w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-accent ${field.state.meta.errors.length ? 'border-destructive' : 'border-border'
                            }`}
                          placeholder="john@example.com"
                        />
                        {field.state.meta.errorMap['onChange'] && (
                          <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errorMap['onChange'])}</p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="subject">
                    {(field) => (
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <select
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Status</option>
                          <option value="return">Returns & Exchanges</option>
                          <option value="product">Product Question</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="message">
                    {(field) => (
                      <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <textarea
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          rows={5}
                          className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${field.state.meta.errorMap['onChange'] ? 'border-destructive' : 'border-border'
                            }`}
                          placeholder="How can we help you?"
                        />
                        {field.state.meta.errorMap['onChange'] && (
                          <p className="text-sm text-destructive mt-1">{getFieldError(field.state.meta.errorMap['onChange'])}</p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => state.isSubmitting}>
                    {(isSubmitting) => (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    )}
                  </form.Subscribe>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-foreground/60 text-sm mb-2">For general inquiries</p>
                    <a href="mailto:hello@nuur.com" className="text-primary hover:underline">
                      hello@nuur.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-foreground/60 text-sm mb-2">Mon-Fri, 9am-6pm EST</p>
                    <a href="tel:+1234567890" className="text-primary hover:underline">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-foreground/60 text-sm">
                      123 Fashion Street<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-foreground/60 text-sm">
                      Monday - Friday: 9am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
