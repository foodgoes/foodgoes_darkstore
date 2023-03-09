import {useState, useContext} from 'react';
import Button from '@/components/elements/button';

import LocationContext from '@/context/location-context';

export default function Address({onClose, productIdAfterLocation=null}) {
    const {location, updateAddress, setProductIdAfterLocation} = useContext(LocationContext);
    const [address, setAddress] = useState(location.address?.address1 || '');

    const handleChange = event => {
        setAddress(event.target.value);
    };

    const handleClick = async () => {
        await updateLocationAPI(address);
        updateAddress({address1: address});
        setProductIdAfterLocation(productIdAfterLocation);
        onClose();
    };

    const updateLocationAPI = async address => {
        const body = {address};
        const res = await fetch('/api/front/location', {method: 'PUT',  headers: {
            'Content-Type': 'application/json',
            }, body: JSON.stringify(body)});

        return await res.json();
    };

    return (
        <div>
            <input type="text" onChange={handleChange} value={address} />
            <Button primary={true} onClick={handleClick}>OK</Button>
        </div> 
    )
}