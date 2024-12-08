#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let regex = regex::Regex::new(r"mul\((\d+),(\d+)\)").unwrap();
    let sum = regex
        .captures_iter(input)
        .map(|m| {
            let a = m.get(1).unwrap().as_str().parse::<usize>().unwrap();
            let b = m.get(2).unwrap().as_str().parse::<usize>().unwrap();
            a * b
        })
        .sum::<usize>();
    Ok(sum.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
        assert_eq!("161", process(input)?);
        Ok(())
    }
}
