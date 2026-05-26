import test from 'node:test';
import assert from 'node:assert/strict';

import { cleanDiffArtifacts } from '../MarkdownRenderer';

test('cleanDiffArtifacts keeps visible BSL examples when response also contains diff blocks', () => {
    const response = [
        'Рекомендованные исправления:',
        '',
        'Исправление логики даты:',
        '```bsl',
        'Если ДатаДанных <> ЭтотОбъект.Дата Тогда',
        '\tВозврат Ложь;',
        'КонецЕсли;',
        '```',
        '',
        '<diff>',
        '<search>',
        'ДатаСовпадает = Истина;',
        '</search>',
        '<replace>',
        'ДатаСовпадает = ПроверитьДатуФайла();',
        '</replace>',
        '</diff>',
    ].join('\n');

    const cleaned = cleanDiffArtifacts(response, 'ДатаСовпадает = Истина;');

    assert.match(cleaned, /```bsl/);
    assert.match(cleaned, /Если ДатаДанных <> ЭтотОбъект\.Дата Тогда/);
    assert.doesNotMatch(cleaned, /<diff>/);
    assert.doesNotMatch(cleaned, /ДатаСовпадает = ПроверитьДатуФайла/);
});
