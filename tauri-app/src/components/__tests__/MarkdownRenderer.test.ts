import test from 'node:test';
import assert from 'node:assert/strict';

import { cleanDiffArtifacts } from '../MarkdownRenderer';

test('cleanDiffArtifacts removes complete Naparnik SEARCH/REPLACE blocks before malformed tails are processed', () => {
    const response = [
        'Исправляю все выявленные ошибки:',
        '',
        '<<<<<<< SEARCH',
        '    ЗаписьЖурналаРегистрации(НСтр("ru = \'Ошибка\'"), УровеньЖурналаРегистрации.Ошибка,,, ПодробноеПредставлениеОшибки(ИнформацияОбОшибке()));',
        '=======',
        '    ЗаписьЖурналаРегистрации(НСтр("ru = \'Ошибка\'"), УровеньЖурналаРегистрации.Ошибка,,, МенеджерОбработкиОшибок.ПодробноеПредставлениеОшибки(ИнформацияОбОшибке()));',
        '>>>>>>> REPLACE',
        '',
        '<<<<<<< SEARCH',
        '// Параметры:',
        '//  ТекущийОбъект - Произвольный',
        '=======',
        '// Параметры:',
        '//  ТекущийОбъект - СправочникОбъект.Номенклатура - сохраняемый объект номенклатуры.',
        '>>>>>>> REPLACE',
        '',
        'Исправлены все 9 диагностик bsl-checker.',
    ].join('\n');

    const cleaned = cleanDiffArtifacts(response, '    ЗаписьЖурналаРегистрации(...);');

    assert.match(cleaned, /Исправляю все выявленные ошибки/);
    assert.match(cleaned, /Исправлены все 9 диагностик/);
    assert.doesNotMatch(cleaned, /<<<<<<< SEARCH/);
    assert.doesNotMatch(cleaned, /^={7}$/m);
    assert.doesNotMatch(cleaned, />>>>>>> REPLACE/);
    assert.doesNotMatch(cleaned, /ЗаписьЖурналаРегистрации/);
    assert.doesNotMatch(cleaned, /ТекущийОбъект - Произвольный/);
    assert.doesNotMatch(cleaned, /СправочникОбъект\.Номенклатура/);
});
