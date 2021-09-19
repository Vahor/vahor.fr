import { forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize"

export interface Props extends TextareaAutosizeProps {
    /** Field name. */
    name: string
    /** Field label. */
    label?: string
    onChange?: any
    outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
    wrapperProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextArea = forwardRef<HTMLTextAreaElement, Props>(
    (
        {
            children,
            name,
            label,
            outerProps = { className: "" },
            wrapperProps = { className: "" },
            onChange,
            className,
            ...props
        },
        ref
    ) => {
        const {
            input,
            meta: { touched, error, submitError, submitting }
        } = useField(name, {
            parse: undefined
        })

        const normalizedError = Array.isArray(error) ? error.join(" ") : error || submitError
        const showError = touched && normalizedError

        return (
            <div
                {...outerProps}
                className={`${outerProps.className} flex flex-wrap flex-grow flex-col text-sm mb-4`}
            >
                {(label) && (
                    <label htmlFor={name} className="block text-gray-900 dark:text-gray-100 text-sm mb-2">
                        <div className="flex justify-between">
                            <span className={"font-semibold"}>{label}</span>
                            {showError && (
                                <span role="alert" className="text-red-400 text-sm">{normalizedError}</span>
                            )}
                        </div>

                    </label>
                )}

                <div {...wrapperProps}>
                    <TextareaAutosize
                        minRows={10}
                        id={name}
                        className={`${showError ? "border-red-400" : "border-gray-300 dark:border-gray-900"}
             shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-gray-100 focus:shadow-outline`}
                        {...input}
                        onChange={(e) => {
                            input.onChange(e)
                            if (onChange) onChange(e)
                        }}
                        disabled={submitting}
                        {...props}
                        style={{ resize: "none" }}
                        ref={ref}
                    />
                    {children && children}
                </div>
            </div>
        )
    }
)

export default LabeledTextArea