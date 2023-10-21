import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CodeEditor from '@uiw/react-textarea-code-editor';
import JsonView from '@uiw/react-json-view';
import type { Addon, AddonVersionConfiguration } from './dataSchemas';
import Ajv2019 from 'ajv/dist/2019';
import * as draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json';
import * as draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json';

interface ValidateResult {
    type: 'bad_json' | 'bad_schema' | 'invalid' | 'valid';
    message: string;
}

const ValidateResultViewer = ({ result }: { result: ValidateResult | null }) => {
    if (result === null) {
        return null;
    }
    if (result.type === 'bad_json') {
        return <Alert severity="error">
            Invalid JSON<br />
            { result.message }
        </Alert>;
    }
    if (result.type === 'bad_schema') {
        return <Alert severity="error">
            Invalid schema<br />
            { result.message }
        </Alert>;
    }
    if (result.type === 'invalid') {
        return <Alert severity="error">
            Invalid, see errors below<br />
            <JsonView
                value={JSON.parse(result.message)}
                shortenTextAfterLength={0}
                displayDataTypes={false}
                displayObjectSize={false}
            />
        </Alert>;
    }
    if (result.type === 'valid') {
        return <Alert severity="success">
            Valid
        </Alert>;
    }
    return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValidator = (schema: AddonVersionConfiguration): { validator: any, strictModeFailureMessage: string | null } => {
    const ajv = new Ajv2019();
    ajv.addMetaSchema(draft6MetaSchema);
    ajv.addMetaSchema(draft7MetaSchema, 'https://json-schema.org/draft-07/schema');
    let validator;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validator = ajv.compile(schema as any);
    } catch (error) {
        const ajvNonStrict = new Ajv2019({
            strict: false,
        });
        ajvNonStrict.addMetaSchema(draft6MetaSchema);
        ajvNonStrict.addMetaSchema(draft7MetaSchema, 'https://json-schema.org/draft-07/schema');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validator = ajvNonStrict.compile(schema as any);
        return {
            validator,
            strictModeFailureMessage: String(error),
        };
    }

    return {
        validator,
        strictModeFailureMessage: null,
    };
};

// A JSX component that takes a JSONSchema POJO as input and contains a text area input and a "Validate" button. When pressed, the input is validated against the schema and the result, success or error, is displayed below the text area.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JSONSchemaValidator = ({ schema }: { schema: AddonVersionConfiguration }) => {
    const [input, setInput] = React.useState('');
    const [result, setResult] = React.useState<ValidateResult | null>(null);
    const [schemaStrictWarning, setSchemaStrictWarning] = React.useState<string | null>(null);

    const validate = () => {
        try {
            const parsedInput = JSON.parse(input);
            // Create a JSON schema validator from the JSON schema POJO using ajv
            let validator, strictModeFailureMessage;
            try {
                const validatorAndStrictMode = getValidator(schema);
                validator = validatorAndStrictMode.validator;
                strictModeFailureMessage = validatorAndStrictMode.strictModeFailureMessage;
            } catch (error) {
                setResult({
                    type: 'bad_schema',
                    message: String(error),
                });
                return;
            }

            setSchemaStrictWarning(strictModeFailureMessage);

            // Validate the input against the schema
            const valid = validator(parsedInput);
            if (valid) {
                setResult({
                    type: 'valid',
                    message: 'Valid',
                });
            } else {
                // Display the error message
                setResult({
                    type: 'invalid',
                    message: JSON.stringify(validator.errors, null, 2),
                });
            }
        } catch (error) {
            let message: string = 'Unknown error';
            if ((error instanceof Error) && (Object.hasOwnProperty.call(error, 'message'))) {
                const errorMessage = error.message;
                if (typeof errorMessage === 'string') {
                    message = errorMessage;
                }
            }
            setResult({
                type: 'bad_json',
                message,
            });
        }
    };

    const pretty = () => {
        let parsedInput;
        try {
            parsedInput = JSON.parse(input);
            
        } catch (error) {
            setResult({
                type: 'bad_json',
                message: String(error),
            });
            return;
        }
        setInput(JSON.stringify(parsedInput, null, 2));
        if (result && result.type === 'bad_json') {
            setResult(null);
        }
    };

    return (
        <Box m={1}>
            <Box m={2}>
                <CodeEditor
                    value={input}
                    language="json"
                    aria-label="JSON input"
                    placeholder="JSON input"
                    onChange={(event) => setInput(event.target.value)}
                    style={{
                        fontSize: 12,
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                    padding={15}
                />
            </Box>

            <Box m={2}>

                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={validate}>Validate</Button>
                    <Button variant="contained" onClick={pretty}>Pretty</Button>
                </Stack>
            </Box>

            <Box m={2}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <ValidateResultViewer result={result} />
                    { schemaStrictWarning && <Alert severity="info">Schema not parsable in strict mode: { schemaStrictWarning }</Alert> }
                </Stack>
            </Box>
        </Box>
    );
};

const AddonViewer = ({ data, selectedAddonVersion, selectedAddonVersionConfiguration }: { data: Addon, selectedAddonVersion: string | null, selectedAddonVersionConfiguration: AddonVersionConfiguration }) => {

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h2">
                { data.addonName }
            </Typography>
            <Stack direction="row" spacing={1}>
                <Chip label={'Type: ' + data.type} />
                <Chip label={'Publisher: ' + data.publisher} />
                <Chip label={'Owner: ' + data.owner} />
                { selectedAddonVersion && <Chip label={'Version: ' + selectedAddonVersion} /> }
            </Stack>

            <br />

            <Divider />

            { selectedAddonVersion && selectedAddonVersionConfiguration && <div>
                <JSONSchemaValidator schema={selectedAddonVersionConfiguration} />

                <Box m={3}>
                    <JsonView
                        value={selectedAddonVersionConfiguration as object}
                        shortenTextAfterLength={0}
                        displayDataTypes={false}
                        displayObjectSize={false}
                    />
                </Box>
            </div>
            }
        </Box>
    );
};

export default AddonViewer;
