import test from 'ava';
import ipRegex from './index.js';

const v4 = [
	'0.0.0.0',
	'8.8.8.8',
	'127.0.0.1',
	'100.100.100.100',
	'192.168.0.1',
	'18.101.25.153',
	'123.23.34.2',
	'172.26.168.134',
	'212.58.241.131',
	'128.0.0.0',
	'23.71.254.72',
	'223.255.255.255',
	'192.0.2.235',
	'99.198.122.146',
	'46.51.197.88',
	'173.194.34.134',
];

const v4not = [
	'10.20.10.993',
	'192.167.2.992',
	'.100.100.100.100',
	'100..100.100.100.',
	'100.100.100.100.',
	'999.999.999.999',
	'256.256.256.256',
	'256.100.100.100.100',
	'123.123.123',
	'http://123.123.123',
	'1000.2.3.4',
	'999.2.3.4',
];

const v4boundaries = {
	'0000000192.168.0.200': ['192.168.0.200'],
	'192.168.0.2000000000': ['192.168.0.200'],
};

const v4extract = {
	'255.255.255.255 0.0.0.0': ['255.255.255.255', '0.0.0.0'],
	'1.2.3.4, 6.7.8.9, 1.2.3.4-5.6.7.8': ['1.2.3.4', '6.7.8.9', '1.2.3.4', '5.6.7.8'],
	'1.2.3.4 6.7.8.9 1.2.3.4 - 5.6.7.8': ['1.2.3.4', '6.7.8.9', '1.2.3.4', '5.6.7.8'],
	'192.168.0.2000000000': ['192.168.0.200'],
};

const v6 = [
	'::',
	'1::',
	'::1',
	'1::8',
	'1::7:8',
	'1:2:3:4:5:6:7:8',
	'1:2:3:4:5:6::8',
	'1:2:3:4:5:6:7::',
	'1:2:3:4:5::7:8',
	'1:2:3:4:5::8',
	'1:2:3::8',
	'1::4:5:6:7:8',
	'1::6:7:8',
	'1::3:4:5:6:7:8',
	'1:2:3:4::6:7:8',
	'1:2::4:5:6:7:8',
	'::2:3:4:5:6:7:8',
	'1:2::8',
	'2001:0000:1234:0000:0000:C1C0:ABCD:0876',
	'3ffe:0b00:0000:0000:0001:0000:0000:000a',
	'FF02:0000:0000:0000:0000:0000:0000:0001',
	'0000:0000:0000:0000:0000:0000:0000:0001',
	'0000:0000:0000:0000:0000:0000:0000:0000',
	'::ffff:192.168.1.26',
	'2::10',
	'ff02::1',
	'fe80::',
	'2002::',
	'2001:db8::',
	'2001:0db8:1234::',
	'::ffff:0:0',
	'::ffff:192.168.1.1',
	'1:2:3:4::8',
	'1::2:3:4:5:6:7',
	'1::2:3:4:5:6',
	'1::2:3:4:5',
	'1::2:3:4',
	'1::2:3',
	'::2:3:4:5:6:7',
	'::2:3:4:5:6',
	'::2:3:4:5',
	'::2:3:4',
	'::2:3',
	'::8',
	'1:2:3:4:5:6::',
	'1:2:3:4:5::',
	'1:2:3:4::',
	'1:2:3::',
	'1:2::',
	'1:2:3:4::7:8',
	'1:2:3::7:8',
	'1:2::7:8',
	'1:2:3:4:5:6:1.2.3.4',
	'1:2:3:4:5::1.2.3.4',
	'1:2:3:4::1.2.3.4',
	'1:2:3::1.2.3.4',
	'1:2::1.2.3.4',
	'1::1.2.3.4',
	'1:2:3:4::5:1.2.3.4',
	'1:2:3::5:1.2.3.4',
	'1:2::5:1.2.3.4',
	'1::5:1.2.3.4',
	'1::5:11.22.33.44',
	'fe80::217:f2ff:254.7.237.98',
	'fe80::217:f2ff:fe07:ed62',
	'2001:DB8:0:0:8:800:200C:417A',
	'FF01:0:0:0:0:0:0:101',
	'0:0:0:0:0:0:0:1',
	'0:0:0:0:0:0:0:0',
	'2001:DB8::8:800:200C:417A',
	'FF01::101',
	'0:0:0:0:0:0:13.1.68.3',
	'0:0:0:0:0:FFFF:129.144.52.38',
	'::13.1.68.3',
	'::FFFF:129.144.52.38',
	'fe80:0000:0000:0000:0204:61ff:fe9d:f156',
	'fe80:0:0:0:204:61ff:fe9d:f156',
	'fe80::204:61ff:fe9d:f156',
	'fe80:0:0:0:204:61ff:254.157.241.86',
	'fe80::204:61ff:254.157.241.86',
	'fe80::1',
	'2001:0db8:85a3:0000:0000:8a2e:0370:7334',
	'2001:db8:85a3:0:0:8a2e:370:7334',
	'2001:db8:85a3::8a2e:370:7334',
	'2001:0db8:0000:0000:0000:0000:1428:57ab',
	'2001:0db8:0000:0000:0000::1428:57ab',
	'2001:0db8:0:0:0:0:1428:57ab',
	'2001:0db8:0:0::1428:57ab',
	'2001:0db8::1428:57ab',
	'2001:db8::1428:57ab',
	'::ffff:12.34.56.78',
	'::ffff:0c22:384e',
	'2001:0db8:1234:0000:0000:0000:0000:0000',
	'2001:0db8:1234:ffff:ffff:ffff:ffff:ffff',
	'2001:db8:a::123',
	'::ffff:192.0.2.128',
	'::ffff:c000:280',
	'a:b:c:d:e:f:f1:f2',
	'a:b:c::d:e:f:f1',
	'a:b:c::d:e:f',
	'a:b:c::d:e',
	'a:b:c::d',
	'::a',
	'::a:b:c',
	'::a:b:c:d:e:f:f1',
	'a::',
	'a:b:c::',
	'a:b:c:d:e:f:f1::',
	'a:bb:ccc:dddd:000e:00f:0f::',
	'0:a:0:a:0:0:0:a',
	'0:a:0:0:a:0:0:a',
	'2001:db8:1:1:1:1:0:0',
	'2001:db8:1:1:1:0:0:0',
	'2001:db8:1:1:0:0:0:0',
	'2001:db8:1:0:0:0:0:0',
	'2001:db8:0:0:0:0:0:0',
	'2001:0:0:0:0:0:0:0',
	'A:BB:CCC:DDDD:000E:00F:0F::',
	'0:0:0:0:0:0:0:a',
	'0:0:0:0:a:0:0:0',
	'0:0:0:a:0:0:0:0',
	'a:0:0:a:0:0:a:a',
	'a:0:0:a:0:0:0:a',
	'a:0:0:0:a:0:0:a',
	'a:0:0:0:a:0:0:0',
	'a:0:0:0:0:0:0:0',
	'fe80::7:8%eth0',
	'fe80::7:8%1',
];

const v6not = [
	'',
	'1:',
	':1',
	'11:36:12',
	'02001:0000:1234:0000:0000:C1C0:ABCD:0876',
	'2001:0000:1234:0000:00001:C1C0:ABCD:0876',
	'2001:0000:1234: 0000:0000:C1C0:ABCD:0876',
	'2001:1:1:1:1:1:255Z255X255Y255',
	'3ffe:0b00:0000:0001:0000:0000:000a',
	'FF02:0000:0000:0000:0000:0000:0000:0000:0001',
	'3ffe:b00::1::a',
	'::1111:2222:3333:4444:5555:6666::',
	'1:2:3::4:5::7:8',
	'12345::6:7:8',
	'1::5:400.2.3.4',
	'1::5:260.2.3.4',
	'1::5:256.2.3.4',
	'1::5:1.256.3.4',
	'1::5:1.2.256.4',
	'1::5:1.2.3.256',
	'1::5:300.2.3.4',
	'1::5:1.300.3.4',
	'1::5:1.2.300.4',
	'1::5:1.2.3.300',
	'1::5:900.2.3.4',
	'1::5:1.900.3.4',
	'1::5:1.2.900.4',
	'1::5:1.2.3.900',
	'1::5:300.300.300.300',
	'1::5:3000.30.30.30',
	'1::400.2.3.4',
	'1::260.2.3.4',
	'1::256.2.3.4',
	'1::1.256.3.4',
	'1::1.2.256.4',
	'1::1.2.3.256',
	'1::300.2.3.4',
	'1::1.300.3.4',
	'1::1.2.300.4',
	'1::1.2.3.300',
	'1::900.2.3.4',
	'1::1.900.3.4',
	'1::1.2.900.4',
	'1::1.2.3.900',
	'1::300.300.300.300',
	'1::3000.30.30.30',
	'::400.2.3.4',
	'::260.2.3.4',
	'::256.2.3.4',
	'::1.256.3.4',
	'::1.2.256.4',
	'::1.2.3.256',
	'::300.2.3.4',
	'::1.300.3.4',
	'::1.2.300.4',
	'::1.2.3.300',
	'::900.2.3.4',
	'::1.900.3.4',
	'::1.2.900.4',
	'::1.2.3.900',
	'::300.300.300.300',
	'::3000.30.30.30',
	'2001:DB8:0:0:8:800:200C:417A:221',
	'FF01::101::2',
	'1111:2222:3333:4444::5555:',
	'1111:2222:3333::5555:',
	'1111:2222::5555:',
	'1111::5555:',
	'::5555:',
	':::',
	'1111:',
	':',
	':1111:2222:3333:4444::5555',
	':1111:2222:3333::5555',
	':1111:2222::5555',
	':1111::5555',
	':::5555',
	'1.2.3.4:1111:2222:3333:4444::5555',
	'1.2.3.4:1111:2222:3333::5555',
	'1.2.3.4:1111:2222::5555',
	'1.2.3.4:1111::5555',
	'1.2.3.4::5555',
	'1.2.3.4::',
	'fe80:0000:0000:0000:0204:61ff:254.157.241.086',
	'123',
	'ldkfj',
	'2001::FFD3::57ab',
	'2001:db8:85a3::8a2e:37023:7334',
	'2001:db8:85a3::8a2e:370k:7334',
	'1:2:3:4:5:6:7:8:9',
	'1::2::3',
	'1:::3:4:5',
	'1:2:3::4:5:6:7:8:9',
	'::ffff:2.3.4',
	'::ffff:257.1.2.3',
	'::ffff:12345678901234567890.1.26',
];

const v6boundaries = {
	'02001:0000:1234:0000:0000:C1C0:ABCD:0876': ['2001:0000:1234:0000:0000:C1C0:ABCD:0876'],
	'fe80:0000:0000:0000:0204:61ff:fe9d:f156245': ['fe80:0000:0000:0000:0204:61ff:fe9d:f156'],
};

const v6extract = {
	'::1, ::2, ::3-::5': ['::1', '::2', '::3', '::5'],
	'::1  ::2 ::3 - ::5': ['::1', '::2', '::3', '::5'],
	'::ffff:192.168.1.1 1::1.2.3.4': ['::ffff:192.168.1.1', '1::1.2.3.4'],
	'02001:0000:1234:0000:0000:C1C0:ABCD:0876 a::xyz': ['2001:0000:1234:0000:0000:C1C0:ABCD:0876', 'a::'],
};

const v4private = [
	'127.0.0.1',
	'10.0.0.0',
	'10.0.0.1',
	'10.9.0.9',
	'10.1.0.2',
	'10.29.232.132',
	'10.149.123.234',
	'10.199.214.239',
	'10.255.0.1',
	'10.255.255.255',
	'10.0.1.20',
	'192.168.0.1',
	'192.168.255.255',
	'192.168.73.253',
	'192.168.12.39',
	'172.16.0.0',
	'172.23.12.32',
	'172.30.85.243',
	'172.31.255.255'
]
const v4privateNot = [
	'10.0.0.991',
	'10.0.0.992',
	'10.0.0.432',
	'10.1.0.999',
	'192.168.12.393',
	'8.8.8.8',
	'192.167.0.1',
	'192.169.0.1',
	'172.0.0.0',
	'172.15.254.132',
	'172.31.256.212',
	'172.15.213.991',
	'10.256.231.231',
	'10.0.1',
	'10.256.0.1'
]

test('private ip', t => {
	for (const fixture of v4private) {
		t.true(ipRegex({isPrivate: true}).test(fixture))
		t.true(ipRegex({exact: true, isPrivate: true}).test(fixture))
	}

	for (const fixture of v4privateNot) {
		t.false(ipRegex({exact: true, isPrivate: true}).test(fixture))
	}
})

test('ip', t => {
	for (const fixture of v4) {
		t.true(ipRegex({exact: true}).test(fixture));
	}

	for (const fixture of v4) {
		t.is((ipRegex().exec(`foo ${fixture} bar`) || [])[0], fixture);
	}

	for (const fixture of v4) {
		t.true(ipRegex().test(`foo${fixture}bar`));
		t.false(ipRegex({includeBoundaries: true}).test(`foo${fixture}bar`));
	}

	for (const fixture of v4not) {
		t.false(ipRegex({exact: true}).test(fixture));
	}

	for (const fixture of v6) {
		t.true(ipRegex({exact: true}).test(fixture));
	}

	for (const fixture of v6) {
		t.is((ipRegex().exec(`foo ${fixture} bar`) || [])[0], fixture);
	}

	for (const fixture of v6) {
		t.true(ipRegex().test(`foo${fixture}bar`));
		t.false(ipRegex({includeBoundaries: true}).test(`foo${fixture}bar`));
	}

	for (const fixture of v6not) {
		t.false(ipRegex({exact: true}).test(fixture));
	}

	for (const fixture of Object.keys(v4boundaries)) {
		t.true(ipRegex().test(fixture));
		t.deepEqual(fixture.match(ipRegex()), v4boundaries[fixture]);
		t.false(ipRegex({includeBoundaries: true}).test(fixture));
		t.is(fixture.match(ipRegex({includeBoundaries: true})), null);
	}

	for (const fixture of Object.keys(v4extract)) {
		t.deepEqual(fixture.match(ipRegex()), v4extract[fixture]);
	}

	for (const fixture of Object.keys(v6boundaries)) {
		t.true(ipRegex().test(fixture));
		t.deepEqual(fixture.match(ipRegex()), v6boundaries[fixture]);
		t.false(ipRegex({includeBoundaries: true}).test(fixture));
		t.is(fixture.match(ipRegex({includeBoundaries: true})), null);
	}

	for (const fixture of Object.keys(v6extract)) {
		t.deepEqual(fixture.match(ipRegex()), v6extract[fixture]);
	}
});

test('ip v4', t => {
	for (const fixture of v4) {
		t.true(ipRegex.v4({exact: true}).test(fixture));
	}

	for (const fixture of v4) {
		t.is((ipRegex.v4().exec(`foo ${fixture} bar`) || [])[0], fixture);
	}

	for (const fixture of v4) {
		t.true(ipRegex.v4().test(`foo${fixture}bar`));
		t.false(ipRegex.v4({includeBoundaries: true}).test(`foo${fixture}bar`));
	}

	for (const fixture of v4not) {
		t.false(ipRegex.v4({exact: true}).test(fixture));
	}

	for (const fixture of Object.keys(v4boundaries)) {
		t.true(ipRegex.v4().test(fixture));
		t.deepEqual(fixture.match(ipRegex.v4()), v4boundaries[fixture]);
		t.false(ipRegex.v4({includeBoundaries: true}).test(fixture));
		t.is(fixture.match(ipRegex.v4({includeBoundaries: true})), null);
	}

	for (const fixture of Object.keys(v4extract)) {
		t.deepEqual(fixture.match(ipRegex.v4()), v4extract[fixture]);
	}
});

test('ip v6', t => {
	for (const fixture of v6) {
		t.true(ipRegex.v6({exact: true}).test(fixture));
	}

	for (const fixture of v6) {
		t.is((ipRegex.v6().exec(`foo ${fixture} bar`) || [])[0], fixture);
	}

	for (const fixture of v6) {
		t.true(ipRegex.v6().test(`foo${fixture}bar`));
		t.false(ipRegex.v6({includeBoundaries: true}).test(`foo${fixture}bar`));
	}

	for (const fixture of v6not) {
		t.false(ipRegex.v6({exact: true}).test(fixture));
	}

	for (const fixture of Object.keys(v6boundaries)) {
		t.true(ipRegex.v6().test(fixture));
		t.deepEqual(fixture.match(ipRegex.v6()), v6boundaries[fixture]);
		t.false(ipRegex.v6({includeBoundaries: true}).test(fixture));
		t.is(fixture.match(ipRegex.v6({includeBoundaries: true})), null);
	}

	for (const fixture of Object.keys(v6extract)) {
		t.deepEqual(fixture.match(ipRegex.v6()), v6extract[fixture]);
	}
});
