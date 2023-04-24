# 此程式會將加法的分類結果回傳
def addition_classify(value1, value2):
    classify_tag = []
    
    # 建立分類規則的字典，用來迭代尋找符合的分類標籤
    classify_rule = {
        "10 以內的加法": __less_than_10,
        "20 以內的加法": __less_than_20,
        "二位數的加法（不進位）": __two_digit_numbers_without_carry,
        "二位數的加法（有進位）": __two_digit_numbers_with_carry,
        "三位數的加法（不進位）": __three_digit_numbers_without_carry,
        "三位數的加法（有進位）": __three_digit_numbers_with_carry,
        "四位數的加法": __four_digit_numbers,
        "十萬以內的加法": __less_than_one_hundred_thousand,
        "大數加法": __addition_of_large_numbers
    }

    try:
        for key in classify_rule:
            if classify_rule[key](value1, value2):
                classify_tag.append(key)

        return classify_tag
    except Exception as err:
        print(err)
        return "addition_classify.py 有 Bug, 須排除"

# 分類規則：10 以內的加法
def __less_than_10(value1, value2):
    if int(value1) + int(value2) <= 10:
        return True
    return False

# 分類規則：20 以內的加法
def __less_than_20(value1, value2):
    if int(value1) + int(value2) <= 20:
        return True
    return False

# 分類規則：二位數的加法（不進位）
def __two_digit_numbers_without_carry(value1, value2):
    if max(len(value1), len(value2)) == 2:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) + int(value2[i]) >= 10:
                return False
        return True
    return False

# 分類規則：二位數的加法（有進位）
def __two_digit_numbers_with_carry(value1, value2):
    if max(len(value1), len(value2)) == 2:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) + int(value2[i]) >= 10:
                return True
        return False
    return False

# 分類規則：三位數的加法（不進位）
def __three_digit_numbers_without_carry(value1, value2):
    if max(len(value1), len(value2)) == 3:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) + int(value2[i]) >= 10:
                return False
        return True
    return False

# 分類規則：三位數的加法（有進位）
def __three_digit_numbers_with_carry(value1, value2):
    if max(len(value1), len(value2)) == 3:
        value1 = list(value1)[::-1]
        value2 = list(value2)[::-1]
        for i in range(min(len(value1), len(value2))):
            if int(value1[i]) + int(value2[i]) >= 10:
                return True
        return False
    return False

# 分類規則：四位數的加法
def __four_digit_numbers(value1, value2):
    if max(len(value1), len(value2)) == 4:
        return True
    return False

# 分類規則：十萬以內的加法
def __less_than_one_hundred_thousand(value1, value2):
    if int(value1) + int(value2) <= 100000:
        return True
    return False

# 分類規則：大數加法
def __addition_of_large_numbers(value1, value2):
    if int(value1) + int(value2) > 100000:
        return True
    return False