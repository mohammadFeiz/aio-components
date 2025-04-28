import { FC, useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './index.css'
import usePopup from '../../npm/aio-popup';
import Icon from '@mdi/react';
import { mdiCameraRetakeOutline, mdiFocusFieldHorizontal } from '@mdi/js';



const DOC_SnaccerInput: FC = () => {
    const [scanned, setScanned] = useState<string>('');

    return (
        <div className="p-12-">
            <ScannerInput
                acceptCondition={(value) => value.length > 8}
                onScan={async (value) => {
                    setScanned(value);
                    return true;
                }}
                attrs={{
                    placeholder: "Scan or enter a value"
                }}
            />
            <div className='aio-input-scanner-result'>
                <h3>اسکن شده:</h3>
                <p>{scanned}</p>
            </div>
        </div>
    )
}
export default DOC_SnaccerInput
type ScannerInputProps = {
    acceptCondition: (value: string) => boolean;
    onScan: (value: string) => boolean | Promise<boolean>;
    attrs?: React.InputHTMLAttributes<HTMLInputElement>;
};

const ScannerInput: FC<ScannerInputProps> = ({ acceptCondition, onScan, attrs = {} }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');
    const popup = usePopup();

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    const handleScan = async (scannedValue: string) => {
        setValue(scannedValue);

        if (!acceptCondition(scannedValue)) {
            return;
        }

        const result = await onScan(scannedValue);

        if (result && inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
            setValue('');
        }
    };

    const handleScanCamera = () => {
        popup.addModal({
            header: { title: 'اسکن توسط دوربین' }, position: 'center',
            body: <RenderCameraScanner onScan={handleScan} onClose={() => popup.removeModal()} />
        });
    };

    return (
        <div className='aio-input-scanner'>
            <input
                ref={inputRef}
                type="text"
                {...attrs}
                value={value}
                onChange={(e) => handleScan(e.target.value)}
            />
            <button className='aio-input-scanner-button' type='button' onClick={handleFocus}>
                <Icon path={mdiFocusFieldHorizontal} size={0.8} />
            </button>
            <button className='aio-input-scanner-button' type='button' onClick={handleScanCamera}>
                <Icon path={mdiCameraRetakeOutline} size={0.8} />
            </button>
            {popup.render()}
        </div>
    );
};

type RenderCameraScannerProps = {
    onScan: (text: string) => void;
    onClose: () => void;
};

const RenderCameraScanner: FC<RenderCameraScannerProps> = ({ onScan, onClose }) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "scanner",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scannerRef.current.render(
            async (decodedText) => {
                await onScan(decodedText);
                await scannerRef.current?.clear();
                onClose();
            },
            (error) => {
                console.warn('خطای اسکن:', error);
            }
        );

        return () => {
            scannerRef.current?.clear().catch((e) => console.error('خطا در پاکسازی اسکنر', e));
        };
    }, []);

    return (
        <div id="scanner" style={{ width: '240px', height: '240px', padding: 12 }} />
    );
};