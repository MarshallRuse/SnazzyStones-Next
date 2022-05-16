import { useState } from "react";
import CTAButton from "./CTAButton";

const formGroupStyling = "w-full flex flex-col items-center gap-2 text-blueyonder-500";
const inputStyling =
    "w-full p-5 bg-zinc-50 border border-zinc-200 rounded-md transition text-blueyonder-300 focus:text-blueyonder-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-bluegreen-400";
export default function ContactUsForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        const emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRegex.test(e.target.value)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (name === "" || email === "" || !emailValid || message === "") {
            return;
        }

        const data = {
            name,
            email,
            subject: subject === "" ? "SnazzyStones.ca Inquiry" : subject,
            message,
        };
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            console.log("responseJSON", response.json());
            setSubject("");
            setMessage("");
        }
    };

    return (
        <form className='py-8 w-full flex flex-col justify-center items-center gap-10'>
            <formGroup className={formGroupStyling}>
                <label htmlFor='name'>Your Name (Required)</label>
                <input
                    type='text'
                    name='name'
                    className={inputStyling}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </formGroup>
            <formGroup className={formGroupStyling}>
                <label htmlFor='email'>Email (required)</label>
                <input
                    type='email'
                    name='email'
                    className={`${inputStyling} pb-3`}
                    value={email}
                    onChange={handleEmailChange}
                />
                <span
                    className={`text-sm ${
                        emailValid ? "text-emerald-400" : "text-blueyonder-300"
                    } w-full text-left h-5`}
                >
                    {email.length > 0
                        ? emailValid
                            ? "That looks like an email!"
                            : "Please enter a valid email address"
                        : ""}
                </span>
            </formGroup>
            <formGroup className={formGroupStyling}>
                <label htmlFor='subject'>Subject</label>
                <input
                    type='text'
                    name='subject'
                    placeholder='SnazzyStones.ca Inquiry'
                    className={inputStyling}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </formGroup>
            <formGroup className={formGroupStyling}>
                <label htmlFor='message'>Message (required)</label>
                <textarea
                    name='message'
                    rows='6'
                    className={`${inputStyling} subtleScrollbar`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </formGroup>
            <CTAButton
                element='button'
                disabled={name === "" || email === "" || !emailValid || message === ""}
                onClick={handleSendMessage}
            >
                Send Message
            </CTAButton>
        </form>
    );
}
