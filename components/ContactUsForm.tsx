'use client';

import { MouseEvent, useState } from 'react';
import { Alert, AlertColor, CircularProgress, Snackbar } from '@mui/material';
import CTAButton from './CTAElements/CTAButton';

const formGroupStyling = 'w-full flex flex-col items-center gap-2 text-blueyonder-500';
const inputStyling =
    'w-full p-5 bg-zinc-50 border border-zinc-200 rounded-md transition text-blueyonder-300 focus:text-blueyonder-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-bluegreen-400';

export default function ContactUsForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState<AlertColor>('success');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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

    const handleSendMessage = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (name === '' || email === '' || !emailValid || message === '') {
            return;
        }
        setSendingEmail(true);

        const data = {
            name,
            email,
            subject: subject === '' ? 'SnazzyStones.ca Inquiry' : subject,
            message,
        };
        const response = await fetch('/api/contactus', {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            setSubject('');
            setMessage('');
            setEmailStatus('success');
            setSnackbarOpen(true);
        } else {
            setEmailStatus('error');
            setSnackbarOpen(true);
        }
        setSendingEmail(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setEmailStatus('success');
    };

    return (
        <form className='py-8 w-full flex flex-col justify-center items-center gap-10'>
            <div className={formGroupStyling}>
                <label htmlFor='name'>Your Name (Required)</label>
                <input
                    type='text'
                    name='name'
                    className={inputStyling}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className={formGroupStyling}>
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
                        emailValid ? 'text-emerald-400' : 'text-blueyonder-300'
                    } w-full text-left h-5`}
                >
                    {email.length > 0
                        ? emailValid
                            ? 'That looks like an email!'
                            : 'Please enter a valid email address'
                        : ''}
                </span>
            </div>
            <div className={formGroupStyling}>
                <label htmlFor='subject'>Subject</label>
                <input
                    type='text'
                    name='subject'
                    placeholder='SnazzyStones.ca Inquiry'
                    className={inputStyling}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
            <div className={formGroupStyling}>
                <label htmlFor='message'>Message (required)</label>
                <textarea
                    name='message'
                    rows={6}
                    className={`${inputStyling} subtleScrollbar`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <CTAButton
                disabled={name === '' || email === '' || !emailValid || message === ''}
                onClick={handleSendMessage}
            >
                {sendingEmail ? (
                    <CircularProgress
                        sx={{ color: '#fff' }}
                        size={17}
                    />
                ) : (
                    'Send Message'
                )}
            </CTAButton>
            <Snackbar
                open={snackbarOpen}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    severity={emailStatus}
                    onClose={handleSnackbarClose}
                >
                    {emailStatus === 'success'
                        ? "Message sent! We'll get back to you shortly."
                        : 'Error sending message, please click the email link.'}
                </Alert>
            </Snackbar>
        </form>
    );
}
