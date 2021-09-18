import { PropsWithoutRef, ReactNode } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import { errorMap } from "@/lib/zod"

export interface FormProps<S extends z.ZodType<any, any>>
    extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
    /** All your form fields */
    children?: ((props: any) => React.ReactNode) | ReactNode
    /** Text to display in the submit button */
    submitText?: string
    schema?: S
    mutators?: any
    onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
    initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
}

export function Form<S extends z.ZodType<any, any>>({
    children,
    submitText,
    schema,
    initialValues,
    onSubmit,
    ...props
}: FormProps<S>) {
    return (
        <FinalForm
            initialValues={initialValues}
            validateOnBlur
            validate={(values) => {
                if (!schema) return
                try {
                    schema.parse(values, { errorMap })
                } catch (error: any) {
                    return error.formErrors.fieldErrors
                }
            }}
            onSubmit={onSubmit}
            {...props}
            render={({ handleSubmit, submitting, pristine }) => {
                return (
                    <form onSubmit={handleSubmit} {...props}>
                        {children}
                        {submitText && (
                            <button
                                type="submit"
                                disabled={submitting || pristine}
                                className="bg-black px-4 py-2 text-white rounded-md hover:bg-white hover:text-gray-900 transition duration-400 border"
                            >
                                {submitText}
                            </button>
                        )}
                    </form>
                )
            }}
        />
    )
}

export default Form